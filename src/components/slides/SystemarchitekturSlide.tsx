"use client";

export default function SystemarchitekturSlide() {
  return (
    <div className="animate-fade-in flex flex-col items-center min-h-[80vh] px-4 pt-4">
      <div className="w-full max-w-[1600px]">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-text-primary">
            Systemarchitektur
          </h2>
        </div>

        <div className="w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 770"
            fontFamily="Inter, system-ui, -apple-system, sans-serif"
            className="w-full h-auto"
          >
            <defs>
              <filter id="shadow" x="-4%" y="-4%" width="108%" height="108%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
              </filter>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
              </marker>
              <marker id="arrow-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7560" />
              </marker>
              <linearGradient id="grad-caddy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f0fdf4" />
                <stop offset="100%" stopColor="#dcfce7" />
              </linearGradient>
              <linearGradient id="grad-nextjs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#f1f5f9" />
              </linearGradient>
              <linearGradient id="grad-houseclaw" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f5f5f0" />
                <stop offset="100%" stopColor="#ecece4" />
              </linearGradient>
              <linearGradient id="grad-supabase" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f0fdf4" />
                <stop offset="100%" stopColor="#d1fae5" />
              </linearGradient>
            </defs>

            <rect width="1200" height="770" fill="#F8F6F0" rx="12" />

            {/* USERS */}
            <g transform="translate(300, 80)">
              <rect width="160" height="50" rx="10" fill="white" stroke="#d4d4d8" strokeWidth="1" filter="url(#shadow)" />
              <text x="80" y="22" textAnchor="middle" fontSize="11" fontWeight="600" fill="#18181b">Verwalter</text>
              <text x="80" y="38" textAnchor="middle" fontSize="9" fill="#71717a">Dashboard · Chat · Agents</text>
            </g>
            <g transform="translate(740, 80)">
              <rect width="160" height="50" rx="10" fill="white" stroke="#d4d4d8" strokeWidth="1" filter="url(#shadow)" />
              <text x="80" y="22" textAnchor="middle" fontSize="11" fontWeight="600" fill="#18181b">Mieter</text>
              <text x="80" y="38" textAnchor="middle" fontSize="9" fill="#71717a">Portal · Telegram · WhatsApp</text>
            </g>

            <line x1="380" y1="130" x2="520" y2="170" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <line x1="820" y1="130" x2="680" y2="170" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="435" y="148" fontSize="8" fill="#a1a1aa" transform="rotate(-12, 435, 148)">HTTPS</text>
            <text x="755" y="148" fontSize="8" fill="#a1a1aa" transform="rotate(12, 755, 148)">HTTPS</text>

            {/* VPS BOUNDARY */}
            <rect x="60" y="160" width="1080" height="590" rx="12" fill="none" stroke="#d4d4d8" strokeWidth="1" strokeDasharray="6,4" />
            <text x="80" y="180" fontSize="10" fontWeight="600" fill="#a1a1aa">Hetzner VPS</text>

            {/* CADDY */}
            <g transform="translate(440, 185)">
              <rect width="320" height="60" rx="10" fill="url(#grad-caddy)" stroke="#86efac" strokeWidth="1.5" filter="url(#shadow)" />
              <text x="160" y="22" textAnchor="middle" fontSize="13" fontWeight="700" fill="#166534">Caddy</text>
              <text x="160" y="38" textAnchor="middle" fontSize="9" fill="#4ade80">Reverse Proxy · Auto-TLS · houseclaw.de</text>
              <text x="160" y="50" textAnchor="middle" fontSize="8" fill="#86efac">:8080 / :8443 (iptables 80→8080, 443→8443)</text>
            </g>

            <line x1="600" y1="245" x2="600" y2="278" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="614" y="266" fontSize="8" fill="#a1a1aa">HTTP :3000</text>

            {/* NEXT.JS */}
            <g transform="translate(340, 280)">
              <rect width="520" height="120" rx="10" fill="url(#grad-nextjs)" stroke="#cbd5e1" strokeWidth="1.5" filter="url(#shadow)" />
              <text x="260" y="22" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a">Next.js 16</text>
              <text x="260" y="38" textAnchor="middle" fontSize="9" fill="#64748b">App Router · Server Components · Server Actions · TypeScript</text>

              <g transform="translate(12, 50)">
                <rect width="115" height="56" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                <text x="57" y="18" textAnchor="middle" fontSize="8" fontWeight="600" fill="#334155">Dashboard</text>
                <text x="57" y="30" textAnchor="middle" fontSize="7" fill="#94a3b8">Shadcn · Recharts</text>
                <text x="57" y="40" textAnchor="middle" fontSize="7" fill="#94a3b8">TanStack · dnd-kit</text>
                <text x="57" y="50" textAnchor="middle" fontSize="7" fill="#94a3b8">React Flow</text>
              </g>
              <g transform="translate(137, 50)">
                <rect width="115" height="56" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                <text x="57" y="18" textAnchor="middle" fontSize="8" fontWeight="600" fill="#334155">Tenant Portal</text>
                <text x="57" y="30" textAnchor="middle" fontSize="7" fill="#94a3b8">Contracts · Docs</text>
                <text x="57" y="40" textAnchor="middle" fontSize="7" fill="#94a3b8">Maintenance</text>
                <text x="57" y="50" textAnchor="middle" fontSize="7" fill="#94a3b8">Statements</text>
              </g>
              <g transform="translate(262, 50)">
                <rect width="115" height="56" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                <text x="57" y="18" textAnchor="middle" fontSize="8" fontWeight="600" fill="#334155">API Routes</text>
                <text x="57" y="30" textAnchor="middle" fontSize="7" fill="#94a3b8">/api/chat · /api/inngest</text>
                <text x="57" y="40" textAnchor="middle" fontSize="7" fill="#94a3b8">/api/integrations</text>
                <text x="57" y="50" textAnchor="middle" fontSize="7" fill="#94a3b8">/api/maintenance</text>
              </g>
              <g transform="translate(387, 50)">
                <rect width="115" height="56" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                <text x="57" y="18" textAnchor="middle" fontSize="8" fontWeight="600" fill="#334155">Data Layer</text>
                <text x="57" y="30" textAnchor="middle" fontSize="7" fill="#94a3b8">Drizzle ORM</text>
                <text x="57" y="40" textAnchor="middle" fontSize="7" fill="#94a3b8">Server Actions</text>
                <text x="57" y="50" textAnchor="middle" fontSize="7" fill="#94a3b8">Zod Validation</text>
              </g>
            </g>

            <line x1="600" y1="400" x2="600" y2="438" stroke="#6b7560" strokeWidth="1.5" markerEnd="url(#arrow-green)" />
            <text x="614" y="422" fontSize="8" fill="#6b7560" fontWeight="500">WebSocket :18789</text>

            <line x1="820" y1="400" x2="960" y2="645" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" strokeDasharray="5,3" />
            <text x="910" y="510" fontSize="8" fill="#a1a1aa" transform="rotate(55, 910, 510)">DATABASE_URL</text>

            {/* HOUSECLAW */}
            <g transform="translate(340, 440)">
              <rect width="520" height="110" rx="10" fill="url(#grad-houseclaw)" stroke="#a3a393" strokeWidth="1.5" filter="url(#shadow)" />
              <text x="260" y="22" textAnchor="middle" fontSize="13" fontWeight="700" fill="#3a4232">HouseClaw</text>
              <text x="260" y="38" textAnchor="middle" fontSize="9" fill="#6b7560">AI Agent Runtime · Gateway :18789</text>

              <g transform="translate(12, 50)">
                <rect width="118" height="48" rx="6" fill="white" stroke="#d4d4c8" strokeWidth="1" />
                <text x="59" y="16" textAnchor="middle" fontSize="8" fontWeight="600" fill="#3a4232">Agents</text>
                <text x="59" y="28" textAnchor="middle" fontSize="7" fill="#6b7560">Cora (main)</text>
                <text x="59" y="38" textAnchor="middle" fontSize="7" fill="#6b7560">Leonie (read-only)</text>
              </g>
              <g transform="translate(140, 50)">
                <rect width="118" height="48" rx="6" fill="white" stroke="#d4d4c8" strokeWidth="1" />
                <text x="59" y="16" textAnchor="middle" fontSize="8" fontWeight="600" fill="#3a4232">AI Models</text>
                <text x="59" y="28" textAnchor="middle" fontSize="7" fill="#6b7560">Gemini 2.5 Pro (eu-west)</text>
                <text x="59" y="38" textAnchor="middle" fontSize="7" fill="#6b7560">Claude Sonnet (eu-central)</text>
              </g>
              <g transform="translate(268, 50)">
                <rect width="118" height="48" rx="6" fill="white" stroke="#d4d4c8" strokeWidth="1" />
                <text x="59" y="16" textAnchor="middle" fontSize="8" fontWeight="600" fill="#3a4232">Skills</text>
                <text x="59" y="28" textAnchor="middle" fontSize="7" fill="#6b7560">rent-monitor</text>
                <text x="59" y="38" textAnchor="middle" fontSize="7" fill="#6b7560">telegram-intake</text>
              </g>
              <g transform="translate(396, 50)">
                <rect width="112" height="48" rx="6" fill="white" stroke="#d4d4c8" strokeWidth="1" />
                <text x="56" y="16" textAnchor="middle" fontSize="8" fontWeight="600" fill="#3a4232">Channels</text>
                <text x="56" y="28" textAnchor="middle" fontSize="7" fill="#6b7560">Telegram Bot</text>
                <text x="56" y="38" textAnchor="middle" fontSize="7" fill="#6b7560">Gmail Hooks</text>
              </g>
            </g>

            <line x1="750" y1="550" x2="960" y2="645" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" strokeDasharray="5,3" />
            <text x="870" y="590" fontSize="8" fill="#a1a1aa" transform="rotate(28, 870, 590)">REST API</text>

            {/* SUPABASE */}
            <g transform="translate(860, 635)">
              <rect width="260" height="95" rx="10" fill="url(#grad-supabase)" stroke="#4ade80" strokeWidth="1.5" filter="url(#shadow)" />
              <text x="130" y="22" textAnchor="middle" fontSize="13" fontWeight="700" fill="#166534">Supabase</text>
              <text x="130" y="38" textAnchor="middle" fontSize="9" fill="#4ade80">Postgres · Auth · Realtime · Storage</text>

              <g transform="translate(10, 48)">
                <rect width="110" height="36" rx="5" fill="white" stroke="#bbf7d0" strokeWidth="1" />
                <text x="55" y="15" textAnchor="middle" fontSize="7" fontWeight="600" fill="#166534">Postgres 15</text>
                <text x="55" y="27" textAnchor="middle" fontSize="7" fill="#4ade80">RLS · pgvector</text>
              </g>
              <g transform="translate(130, 48)">
                <rect width="110" height="36" rx="5" fill="white" stroke="#bbf7d0" strokeWidth="1" />
                <text x="55" y="15" textAnchor="middle" fontSize="7" fontWeight="600" fill="#166534">Auth + Storage</text>
                <text x="55" y="27" textAnchor="middle" fontSize="7" fill="#4ade80">JWT · S3 · Realtime</text>
              </g>
            </g>

            {/* INTEGRATIONS */}
            <g transform="translate(75, 440)">
              <rect width="220" height="190" rx="10" fill="white" stroke="#e2e8f0" strokeWidth="1" filter="url(#shadow)" />
              <text x="110" y="20" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">Integrations</text>

              <g transform="translate(10, 32)">
                <rect width="96" height="30" rx="5" fill="#fef2f2" stroke="#fecaca" strokeWidth="1" />
                <text x="48" y="13" textAnchor="middle" fontSize="7" fontWeight="600" fill="#991b1b">Sparkasse</text>
                <text x="48" y="23" textAnchor="middle" fontSize="6" fill="#dc2626">finAPI · PSD2</text>
              </g>
              <g transform="translate(114, 32)">
                <rect width="96" height="30" rx="5" fill="#fef2f2" stroke="#fecaca" strokeWidth="1" />
                <text x="48" y="13" textAnchor="middle" fontSize="7" fontWeight="600" fill="#991b1b">Gmail</text>
                <text x="48" y="23" textAnchor="middle" fontSize="6" fill="#dc2626">OAuth2 · Hooks</text>
              </g>
              <g transform="translate(10, 70)">
                <rect width="96" height="30" rx="5" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
                <text x="48" y="13" textAnchor="middle" fontSize="7" fontWeight="600" fill="#1e40af">Outlook</text>
                <text x="48" y="23" textAnchor="middle" fontSize="6" fill="#3b82f6">Azure AD OAuth</text>
              </g>
              <g transform="translate(114, 70)">
                <rect width="96" height="30" rx="5" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
                <text x="48" y="13" textAnchor="middle" fontSize="7" fontWeight="600" fill="#166534">WhatsApp</text>
                <text x="48" y="23" textAnchor="middle" fontSize="6" fill="#22c55e">Baileys · QR</text>
              </g>
              <g transform="translate(10, 108)">
                <rect width="96" height="30" rx="5" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
                <text x="48" y="13" textAnchor="middle" fontSize="7" fontWeight="600" fill="#1e40af">Telegram</text>
                <text x="48" y="23" textAnchor="middle" fontSize="6" fill="#3b82f6">Bot API</text>
              </g>
              <g transform="translate(114, 108)">
                <rect width="96" height="30" rx="5" fill="#faf5ff" stroke="#e9d5ff" strokeWidth="1" />
                <text x="48" y="13" textAnchor="middle" fontSize="7" fontWeight="600" fill="#6b21a8">Resend</text>
                <text x="48" y="23" textAnchor="middle" fontSize="6" fill="#a855f7">Email API</text>
              </g>
              <g transform="translate(10, 146)">
                <rect width="96" height="30" rx="5" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
                <text x="48" y="13" textAnchor="middle" fontSize="7" fontWeight="600" fill="#1e40af">LetterXpress</text>
                <text x="48" y="23" textAnchor="middle" fontSize="6" fill="#3b82f6">Physical Mail</text>
              </g>
              <g transform="translate(114, 146)">
                <rect width="96" height="30" rx="5" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
                <text x="48" y="13" textAnchor="middle" fontSize="7" fontWeight="600" fill="#9a3412">Brunata</text>
                <text x="48" y="23" textAnchor="middle" fontSize="6" fill="#f97316">Meter Import</text>
              </g>
            </g>

            <line x1="295" y1="490" x2="340" y2="490" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <line x1="295" y1="520" x2="340" y2="520" stroke="#6b7560" strokeWidth="1.5" markerEnd="url(#arrow-green)" />

            {/* INNGEST */}
            <g transform="translate(860, 560)">
              <rect width="260" height="40" rx="10" fill="white" stroke="#d4d4d8" strokeWidth="1" filter="url(#shadow)" />
              <text x="130" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="#18181b">Inngest</text>
              <text x="130" y="30" textAnchor="middle" fontSize="8" fill="#71717a">Background Jobs · Cron · Step Functions</text>
            </g>

            <line x1="860" y1="575" x2="800" y2="400" stroke="#94a3b8" strokeWidth="1" markerEnd="url(#arrow)" strokeDasharray="4,3" />
            <text x="845" y="485" fontSize="8" fill="#a1a1aa" transform="rotate(-68, 845, 485)">/api/inngest</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
