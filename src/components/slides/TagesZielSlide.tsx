"use client";

const GOALS = [
  {
    title: "Agent Harness",
    desc: "Die Infrastruktur einrichten, auf der KI-Agenten sicher laufen",
  },
  {
    title: "System anlernen",
    desc: "Prozesse, Daten und Kontext von Sperr & Zellner einspielen",
  },
  {
    title: "Pilot Use-Case definieren",
    desc: "Den ersten konkreten Anwendungsfall für den Produktiv-Start wählen",
  },
];

export default function TagesZielSlide() {
  return (
    <div className="animate-fade-in flex flex-col items-center min-h-[80vh] px-8 pt-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary">
            Tagesziel definieren
          </h2>
        </div>

        <div className="space-y-5">
          {GOALS.map((goal, i) => (
            <div
              key={i}
              className="flex items-baseline gap-6 animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="text-lg font-semibold text-text-secondary w-8 shrink-0 text-right">
                {i + 1}
              </span>
              <div className="flex-1 border-b border-border pb-4">
                <span className="text-xl font-semibold text-text-primary">
                  {goal.title}
                </span>
                <p className="text-base text-text-secondary mt-1">{goal.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
