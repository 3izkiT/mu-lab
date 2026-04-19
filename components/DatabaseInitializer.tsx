"use client";

import { useEffect } from "react";

export function DatabaseInitializer() {
  useEffect(() => {
    const initDb = async () => {
      try {
        const response = await fetch("/api/db/init", {
          method: "GET",
          cache: "no-store",
        });
        const data = await response.json();
        console.log("[DB Init]", data);
      } catch (err) {
        // Silently fail - database might already be initialized
        console.log("[DB Init] Request failed (expected if already initialized):", err);
      }
    };

    initDb();
  }, []);

  return null; // Invisible component
}
