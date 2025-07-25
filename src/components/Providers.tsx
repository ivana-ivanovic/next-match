"use client";

import { HeroUIProvider } from "@heroui/system";
import { ReactNode } from "react";

export default function Providers({children}: { children: ReactNode }) {
  return (
    <HeroUIProvider>
      {children}
    </HeroUIProvider>
  )
}