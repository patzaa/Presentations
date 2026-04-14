"use client";

import { useState, useRef, useCallback, useEffect, type RefCallback } from "react";
import { DotLottie } from "@lottiefiles/dotlottie-web";
import { useStore } from "@/lib/store";

const GEMINI_WS_URL =
  "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent";

/** Downsample Float32 from sourceSR to targetSR */
function downsample(buf: Float32Array, srcRate: number, tgtRate: number): Float32Array {
  if (srcRate === tgtRate) return buf;
  const ratio = srcRate / tgtRate;
  const len = Math.round(buf.length / ratio);
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const idx = i * ratio;
    const lo = Math.floor(idx);
    const hi = Math.min(lo + 1, buf.length - 1);
    const f = idx - lo;
    out[i] = buf[lo] * (1 - f) + buf[hi] * f;
  }
  return out;
}

/** Float32 → 16-bit PCM → base64 */
function pcm16Base64(f32: Float32Array): string {
  const i16 = new Int16Array(f32.length);
  for (let i = 0; i < f32.length; i++) {
    const s = Math.max(-1, Math.min(1, f32[i]));
    i16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(i16.buffer);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

interface AudioDevice { deviceId: string; label: string }

export default function IstAnalyseSlide() {
  const { data, updateAnswer } = useStore();
  const [currentQ, setCurrentQ] = useState(0);
  const [recording, setRecording] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [showDevicePicker, setShowDevicePicker] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const procRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const answerRef = useRef("");
  const qRef = useRef(0);
  const bufRef = useRef<Float32Array[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const readyRef = useRef(false);
  const stoppingRef = useRef(false);
  const turnTextRef = useRef("");
  const srRef = useRef(48000);

  const lottieRef = useRef<DotLottie | null>(null);
  const lottieCanvasRef: RefCallback<HTMLCanvasElement> = useCallback((canvas) => {
    if (canvas) {
      if (lottieRef.current) {
        lottieRef.current.destroy();
        lottieRef.current = null;
      }
      lottieRef.current = new DotLottie({
        autoplay: false,
        loop: true,
        canvas,
        src: "https://lottie.host/458c38c2-f809-4f7d-8c90-e4aec393561b/Eh2WgRLJjo.lottie",
      });
    }
  }, []);

  // Control lottie — only play when WS is connected and audio is flowing
  useEffect(() => {
    if (!lottieRef.current) return;
    if (recording && readyRef.current) {
      lottieRef.current.play();
    } else {
      lottieRef.current.stop();
    }
  }, [recording]);

  // Also check readyRef periodically while recording to start lottie once WS is ready
  useEffect(() => {
    if (!recording) return;
    const check = setInterval(() => {
      if (lottieRef.current && readyRef.current) {
        lottieRef.current.play();
        clearInterval(check);
      }
    }, 200);
    return () => clearInterval(check);
  }, [recording]);

  const devicesLoadedRef = useRef(false);
  const questions = data.istAnalyse;
  const total = questions.length;

  // Load audio devices (requires user gesture for mic permission on deployed sites)
  const loadDevices = useCallback(async () => {
    if (devicesLoadedRef.current) return;
    try {
      const tmp = await navigator.mediaDevices.getUserMedia({ audio: true });
      tmp.getTracks().forEach((t) => t.stop());
      const devs = await navigator.mediaDevices.enumerateDevices();
      const inputs = devs
        .filter((d) => d.kind === "audioinput")
        .map((d) => ({ deviceId: d.deviceId, label: d.label || `Mic ${d.deviceId.slice(0, 8)}` }));
      setAudioDevices(inputs);
      const builtin = inputs.find((d) => d.label.toLowerCase().includes("built-in"));
      if (!selectedDevice) {
        setSelectedDevice(builtin?.deviceId || inputs[0]?.deviceId || "");
      }
      devicesLoadedRef.current = true;
    } catch (err) {
      console.error("Could not enumerate audio devices:", err);
    }
  }, [selectedDevice]);

  useEffect(() => { qRef.current = currentQ; answerRef.current = questions[currentQ].answer; }, [currentQ, questions]);
  useEffect(() => () => { cleanup(); }, []);

  const cleanup = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (procRef.current) { procRef.current.disconnect(); procRef.current = null; }
    if (sourceRef.current) { sourceRef.current.disconnect(); sourceRef.current = null; }
    if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
    readyRef.current = false;
  };

  const flushAudio = useCallback(() => {
    if (!bufRef.current.length || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !readyRef.current) return;
    const total = bufRef.current.reduce((s, b) => s + b.length, 0);
    const merged = new Float32Array(total);
    let off = 0;
    for (const b of bufRef.current) { merged.set(b, off); off += b.length; }
    bufRef.current = [];
    const down = downsample(merged, srRef.current, 16000);
    const b64 = pcm16Base64(down);
    try {
      wsRef.current.send(JSON.stringify({
        realtimeInput: { audio: { data: b64, mimeType: "audio/pcm;rate=16000" } },
      }));
    } catch (e) { console.error("WS send error:", e); }
  }, []);

  const startCapture = useCallback((ctx: AudioContext, stream: MediaStream) => {
    const src = ctx.createMediaStreamSource(stream);
    sourceRef.current = src;
    const proc = ctx.createScriptProcessor(4096, 1, 1);
    procRef.current = proc;
    proc.onaudioprocess = (e) => { bufRef.current.push(new Float32Array(e.inputBuffer.getChannelData(0))); };
    src.connect(proc);
    proc.connect(ctx.destination);
    timerRef.current = setInterval(flushAudio, 250);
    console.log("Audio capture started");
  }, [flushAudio]);

  const startRecording = useCallback(async () => {
    try {
      // 0. Ensure devices are loaded (first click grants mic permission)
      await loadDevices();

      // 1. API key
      const keyRes = await fetch("/api/gemini-key");
      if (!keyRes.ok) { alert("GEMINI_API_KEY nicht konfiguriert"); return; }
      const { key } = await keyRes.json();

      // 2. Mic / BlackHole
      const constraints: MediaTrackConstraints = { channelCount: 1 };
      if (selectedDevice) constraints.deviceId = { exact: selectedDevice };
      const isVirtual = audioDevices.find((d) => d.deviceId === selectedDevice)?.label.toLowerCase().includes("blackhole");
      if (!isVirtual) { constraints.echoCancellation = true; constraints.noiseSuppression = true; }
      const mic = await navigator.mediaDevices.getUserMedia({ audio: constraints });
      streamRef.current = mic;

      // 3. AudioContext (native rate, we downsample later)
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      srRef.current = ctx.sampleRate;
      answerRef.current = questions[currentQ].answer;
      stoppingRef.current = false;
      turnTextRef.current = "";
      bufRef.current = [];
      // Resume context — user gesture may be lost after awaits above
      if (ctx.state === "suspended") await ctx.resume();

      // Start capturing audio immediately (buffer until WS ready)
      startCapture(ctx, mic);

      // 4. WebSocket
      const ws = new WebSocket(`${GEMINI_WS_URL}?key=${key}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WS open, sending setup...");
        ws.send(JSON.stringify({
          setup: {
            model: "models/gemini-2.5-flash-native-audio-preview-12-2025",
            generationConfig: { responseModalities: ["AUDIO"] },
            inputAudioTranscription: {},
          },
        }));
      };

      ws.onmessage = async (evt) => {
        try {
          let raw: string;
          if (typeof evt.data === "string") {
            raw = evt.data;
          } else if (evt.data instanceof Blob) {
            raw = await evt.data.text();
          } else if (evt.data instanceof ArrayBuffer) {
            raw = new TextDecoder().decode(evt.data);
          } else {
            return;
          }

          // Skip raw binary audio data
          if (!raw.startsWith("{")) return;

          const msg = JSON.parse(raw);

          if (msg.setupComplete !== undefined) {
            console.log("Gemini setup complete ✓");
            readyRef.current = true;
            return;
          }

          const sc = msg.serverContent;
          if (!sc) return;

          if (sc.inputTranscription?.text) {
            turnTextRef.current += sc.inputTranscription.text;
            setInterimText(turnTextRef.current);
          }

          if (sc.turnComplete && !stoppingRef.current) {
            const text = turnTextRef.current.trim();
            turnTextRef.current = "";
            setInterimText("");
            if (text) {
              const sep = answerRef.current.trim() ? " " : "";
              answerRef.current += sep + text;
              queueMicrotask(() => updateAnswer(qRef.current, answerRef.current));
            }
          }
        } catch (err) {
          console.error("WS msg error:", err);
        }
      };

      ws.onerror = () => console.error("WS error");
      ws.onclose = (e) => console.log("WS closed:", e.code, e.reason);

      setRecording(true);
    } catch (err) {
      console.error("Start error:", err);
      alert("Mikrofon-Zugriff nicht möglich.");
    }
  }, [currentQ, questions, updateAnswer, flushAudio, startCapture, selectedDevice, audioDevices, loadDevices]);

  const stopRecording = useCallback(() => {
    stoppingRef.current = true;
    // Close WebSocket immediately to prevent duplicate transcription events
    if (wsRef.current) { wsRef.current.onmessage = null; wsRef.current.close(); wsRef.current = null; }
    // Stop audio capture
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (procRef.current) { procRef.current.disconnect(); procRef.current = null; }
    if (sourceRef.current) { sourceRef.current.disconnect(); sourceRef.current = null; }
    if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    readyRef.current = false;
    bufRef.current = [];
    // Flush any remaining text into the answer
    const remaining = turnTextRef.current.trim();
    turnTextRef.current = "";
    setInterimText("");
    if (remaining) {
      const sep = answerRef.current.trim() ? " " : "";
      answerRef.current += sep + remaining;
      updateAnswer(qRef.current, answerRef.current);
    }
    setRecording(false);
  }, [updateAnswer]);

  const saveMarkdown = useCallback(() => {
    const date = new Date().toLocaleDateString("de-DE");
    let md = `# Ist-Analyse — ${data.companyName}\n\n`;
    md += `**Datum:** ${date}\n\n---\n\n`;
    questions.forEach((q, i) => {
      md += `## ${i + 1}. ${q.question}\n\n`;
      md += q.answer ? `${q.answer}\n\n` : `*Keine Antwort*\n\n`;
    });
    const filename = `Ist-Analyse_${data.companyName.replace(/\s+/g, "_")}.md`;
    fetch("/api/save-istanalyse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown: md, filename }),
    }).catch((err) => console.error("Save error:", err));
  }, [questions, data.companyName]);

  const displayValue = questions[currentQ].answer
    + (interimText ? (questions[currentQ].answer.trim() ? " " : "") + interimText : "");

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[80vh] px-8">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-text-primary">Ist-Analyse</h2>
        </div>

        <div className="flex items-center gap-2 mb-8 justify-center">
          {questions.map((_, i) => (
            <button key={i} onClick={() => { if (recording) stopRecording(); setCurrentQ(i); }}
              className={`h-2 rounded-full transition-all ${i === currentQ ? "w-8 bg-text-primary" : i < currentQ ? "w-4 bg-text-primary/40" : "w-4 bg-border"}`} />
          ))}
          <span className="ml-3 text-xs text-text-secondary font-medium">{currentQ + 1} / {total}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Prev button — outside card */}
          <button onClick={() => { if (recording) stopRecording(); setCurrentQ(Math.max(0, currentQ - 1)); }} disabled={currentQ === 0}
            className="p-2 rounded-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed text-text-secondary hover:text-text-primary shrink-0"
            title="Vorherige Frage">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5l-7.5-7.5 7.5-7.5" />
            </svg>
          </button>

          {/* Card */}
          <div key={currentQ} className="animate-slide-in bg-bg-card rounded-2xl border border-border p-8 shadow-sm relative flex-1">
            {/* Audio device picker */}
            <div className="absolute top-3 right-3">
              <button
                onClick={async () => {
                  await loadDevices();
                  setShowDevicePicker(!showDevicePicker);
                }}
                className="opacity-20 hover:opacity-60 transition-opacity text-lg"
                title="Audio-Gerät wählen"
              >⚙️</button>
              {showDevicePicker && audioDevices.length > 0 && (
                <div className="absolute right-0 top-8 z-10 bg-bg-card border border-border rounded-lg shadow-lg p-2 min-w-[220px]">
                  {audioDevices.map((d) => (
                      <button key={d.deviceId}
                        onClick={() => { setSelectedDevice(d.deviceId); setShowDevicePicker(false); }}
                        disabled={recording}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all
                          ${d.deviceId === selectedDevice ? "bg-accent-purple/10 text-accent-purple font-medium" : "text-text-secondary hover:bg-bg-secondary"}`}>
                        {d.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            <p className="text-xl font-semibold text-text-primary mb-6 leading-relaxed pr-8">{questions[currentQ].question}</p>

            <textarea value={displayValue} onChange={(e) => { if (!recording) updateAnswer(currentQ, e.target.value); }}
              readOnly={recording} placeholder="Notizen hier eingeben oder Mikrofon nutzen..."
              className="w-full h-80 p-4 rounded-xl bg-bg-primary border border-border text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent-purple/30 resize-none text-base leading-relaxed" />

            {/* Lottie mic button — centered below textarea */}
            <div className="flex justify-center mt-4">
              <button
                onClick={recording ? stopRecording : startRecording}
                className="relative cursor-pointer"
                title={recording ? "Aufnahme stoppen" : "Spracheingabe starten"}
              >
                <canvas
                  ref={lottieCanvasRef}
                  width={120}
                  height={120}
                  className={`transition-opacity ${recording ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
                  style={{ width: "80px", height: "80px" }}
                />
              </button>
            </div>
          </div>

          {/* Next button — outside card */}
          <button onClick={() => { if (recording) stopRecording(); saveMarkdown(); setCurrentQ(Math.min(total - 1, currentQ + 1)); }} disabled={currentQ === total - 1}
            className="p-2 rounded-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed text-text-secondary hover:text-text-primary shrink-0"
            title="Nächste Frage">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {questions.some((q) => q.answer) && (
          <div className="mt-8 p-4 bg-bg-secondary rounded-xl">
            <p className="text-xs font-medium text-text-secondary mb-3 uppercase tracking-wider">Bisherige Notizen</p>
            <div className="space-y-2">
              {questions.map((q, i) => q.answer && (
                <div key={i} className="flex gap-3 text-sm cursor-pointer hover:bg-bg-card/50 p-2 rounded-lg transition-all" onClick={() => { if (recording) stopRecording(); setCurrentQ(i); }}>
                  <span className="text-accent-teal font-bold shrink-0">{i + 1}.</span>
                  <span className="text-text-secondary line-clamp-1">{q.answer}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
