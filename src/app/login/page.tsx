"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login fehlgeschlagen");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Verbindungsfehler");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/sperr-zellner-logo.png" alt="Sperr & Zellner" className="h-32 mx-auto" />
        </div>

        <form onSubmit={handleSubmit} className="bg-bg-card border border-border rounded-2xl p-8 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Benutzername</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="daniel oder michael"
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border text-text-primary
                placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent-purple/30 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border text-text-primary
                focus:outline-none focus:ring-2 focus:ring-accent-purple/30 text-sm"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full py-2.5 rounded-xl bg-text-primary text-white font-medium text-sm
              hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Anmelden..." : "Anmelden"}
          </button>
        </form>
      </div>
    </div>
  );
}
