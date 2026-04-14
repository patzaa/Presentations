// In-memory store for real-time sync of use-cases
// Stores full use-case data so all clients see the same state

import { UseCase } from "@/lib/types";

let syncedUseCases: UseCase[] = [];
let lastUpdate = 0;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const since = parseInt(url.searchParams.get("since") || "0");

  if (since >= lastUpdate) {
    return Response.json({ updated: false, timestamp: lastUpdate });
  }

  return Response.json({ updated: true, useCases: syncedUseCases, timestamp: lastUpdate });
}

export async function POST(request: Request) {
  const { useCases } = await request.json();
  syncedUseCases = useCases;
  lastUpdate = Date.now();
  return Response.json({ ok: true, timestamp: lastUpdate });
}
