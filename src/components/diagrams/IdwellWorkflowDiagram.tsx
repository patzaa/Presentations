"use client";

import { useState } from "react";

interface Props {
  useCaseTitle: string;
}

function getNodes(title: string) {
  return [
    {
      id: "trigger",
      label: "Webhook Trigger",
      sub: "idwell API",
      x: 0,
      y: 100,
      w: 64,
      h: 64,
      type: "idwell" as const,
    },
    {
      id: "classify",
      label: "KI Kategorisierung",
      sub: "Agent",
      x: 160,
      y: 100,
      w: 170,
      h: 64,
      type: "ai" as const,
    },
    {
      id: "enrich",
      label: title,
      sub: "Ticket erstellen & zuweisen",
      x: 420,
      y: 100,
      w: 180,
      h: 64,
      type: "action" as const,
    },
    {
      id: "respond",
      label: "Ticket speichern",
      sub: "idwell API",
      x: 700,
      y: 100,
      w: 64,
      h: 64,
      type: "idwell" as const,
    },
  ];
}

function getDescriptions(title: string): Record<string, { title: string; detail: string }> {
  return {
    trigger: {
      title: "1. Webhook Trigger — idwell API",
      detail:
        "Ein neuer Vorgang wird in idwell erstellt. Die API sendet automatisch einen Webhook mit allen relevanten Daten an den KI-Workflow.",
    },
    classify: {
      title: "2. KI Kategorisierung",
      detail:
        "Ein KI-Agent analysiert den eingehenden Vorgang: Erkennt die Kategorie, bewertet die Dringlichkeit und extrahiert Schlüsselinformationen.",
    },
    enrich: {
      title: `3. ${title}`,
      detail:
        "Basierend auf der KI-Analyse wird ein strukturiertes Ticket erstellt: Kategorie, Titel, Beschreibung, Priorität und alle relevanten Daten werden automatisch zugewiesen.",
    },
    respond: {
      title: "4. Antwort an idwell senden",
      detail:
        "Das fertige Ticket wird über die idwell API zurück ins System geschrieben. Der Vorgang ist aktualisiert mit Kategorie, Zuordnung und nächsten Schritten.",
    },
  };
}

export default function IdwellWorkflowDiagram({ useCaseTitle }: Props) {
  const [selected, setSelected] = useState<string>("trigger");
  const nodes = getNodes(useCaseTitle);
  const descriptions = getDescriptions(useCaseTitle);

  return (
    <div>
      <svg width="100%" viewBox="0 0 810 220" className="mb-4">
        <defs>
          <marker
            id="wf-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path
              d="M2 1L8 5L2 9"
              fill="none"
              stroke="context-stroke"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        </defs>

        {/* Connections with connector dots */}
        {nodes.slice(0, -1).map((node, i) => {
          const next = nodes[i + 1];
          const x1 = node.x + 22 + node.w;
          const x2 = next.x + 22;
          const cy = node.y + node.h / 2;
          return (
            <g key={`conn-${i}`}>
              {/* Connector dot on source */}
              <circle cx={x1} cy={cy} r="4" fill="#9CA3AF" stroke="#fff" strokeWidth="1.5" />
              {/* Line */}
              <line
                x1={x1 + 6}
                y1={cy}
                x2={x2 - 6}
                y2={next.y + next.h / 2}
                stroke="#9CA3AF"
                strokeWidth="1.5"
                markerEnd="url(#wf-arrow)"
              />
              {/* Connector dot on target */}
              <circle cx={x2} cy={next.y + next.h / 2} r="4" fill="#9CA3AF" stroke="#fff" strokeWidth="1.5" />
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isSelected = selected === node.id;
          const nx = node.x + 22;
          const ny = node.y;

          if (node.type === "idwell") {
            // N8N-style rounded square with idwell logo
            return (
              <g
                key={node.id}
                onClick={() => setSelected(node.id)}
                className="cursor-pointer"
                opacity={isSelected ? 1 : 0.7}
              >
                {isSelected && (
                  <rect
                    x={nx - 3}
                    y={ny - 3}
                    width={node.w + 6}
                    height={node.h + 6}
                    rx="16"
                    fill="none"
                    stroke="#E85B6F"
                    strokeWidth="2"
                    opacity="0.3"
                  />
                )}
                {/* White rounded square background */}
                <rect
                  x={nx}
                  y={ny}
                  width={node.w}
                  height={node.h}
                  rx="14"
                  fill="#FFFFFF"
                  stroke={isSelected ? "#E85B6F" : "#D1D0CC"}
                  strokeWidth={isSelected ? "1.5" : "0.5"}
                />
                {/* idwell bird logo */}
                <image
                  href="/idwell-logo.webp"
                  x={nx + 12}
                  y={ny + 12}
                  width={node.w - 24}
                  height={node.h - 24}
                  preserveAspectRatio="xMidYMid meet"
                />
                {/* Label below */}
                <text
                  x={nx + node.w / 2}
                  y={ny + node.h + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="500"
                  fill="#2D2B28"
                >
                  {node.label}
                </text>
                <text
                  x={nx + node.w / 2}
                  y={ny + node.h + 28}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#6B6965"
                >
                  {node.sub}
                </text>
              </g>
            );
          }

          // Regular workflow nodes (AI, action)
          const color = node.type === "ai" ? "#0F6E56" : "#D85A30";
          const bg = node.type === "ai" ? "#E1F5EE" : "#FAECE7";

          return (
            <g
              key={node.id}
              onClick={() => setSelected(node.id)}
              className="cursor-pointer"
              opacity={isSelected ? 1 : 0.7}
            >
              {isSelected && (
                <rect
                  x={nx - 3}
                  y={ny - 3}
                  width={node.w + 6}
                  height={node.h + 6}
                  rx="15"
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  opacity="0.3"
                />
              )}
              <rect
                x={nx}
                y={ny}
                width={node.w}
                height={node.h}
                rx="12"
                fill={bg}
                stroke={color}
                strokeWidth={isSelected ? "1.5" : "0.5"}
              />
              {/* Icon */}
              <circle
                cx={nx + 20}
                cy={ny + node.h / 2}
                r="12"
                fill={color}
                opacity="0.15"
              />
              {node.type === "ai" ? (
                <g color={color}>
                  <g transform={`translate(${nx + 14}, ${ny + node.h / 2 - 6})`}>
                    <circle cx="6" cy="3" r="2.5" fill="none" stroke={color} strokeWidth="1.2" />
                    <path d="M0 12 Q6 7 12 12" fill="none" stroke={color} strokeWidth="1.2" />
                    <line x1="6" y1="5.5" x2="6" y2="7" stroke={color} strokeWidth="1.2" />
                  </g>
                </g>
              ) : (
                <g transform={`translate(${nx + 14}, ${ny + node.h / 2 - 6})`}>
                  <rect x="1" y="0" width="10" height="12" rx="1.5" fill="none" stroke={color} strokeWidth="1.2" />
                  <line x1="3.5" y1="3.5" x2="8.5" y2="3.5" stroke={color} strokeWidth="1" />
                  <line x1="3.5" y1="6" x2="8.5" y2="6" stroke={color} strokeWidth="1" />
                  <line x1="3.5" y1="8.5" x2="6.5" y2="8.5" stroke={color} strokeWidth="1" />
                </g>
              )}
              {/* Label */}
              <text
                x={nx + 38}
                y={ny + node.h / 2 - 6}
                fontSize="11"
                fontWeight="600"
                fill="#2D2B28"
              >
                {node.label.length > 22 ? node.label.slice(0, 20) + "..." : node.label}
              </text>
              <text
                x={nx + 38}
                y={ny + node.h / 2 + 10}
                fontSize="10"
                fill="#6B6965"
              >
                {node.sub}
              </text>
            </g>
          );
        })}

        {/* Bottom flow label */}
        <g opacity="0.5">
          <text x="405" y="205" textAnchor="middle" fontSize="11" fill="#6B6965">
            Vollautomatischer Workflow — keine manuelle Zuordnung nötig
          </text>
        </g>
      </svg>

      {/* Description */}
      <div className="min-h-[48px]">
        <p className="text-sm font-semibold text-text-primary mb-1">
          {descriptions[selected].title}
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          {descriptions[selected].detail}
        </p>
      </div>
    </div>
  );
}
