"use client";

import { StoreProvider } from "@/lib/store";
import Presentation from "@/components/Presentation";

export default function Home() {
  return (
    <StoreProvider>
      <Presentation />
    </StoreProvider>
  );
}
