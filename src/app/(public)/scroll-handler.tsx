"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ScrollHandler() {
  const searchParams = useSearchParams();
  const section = searchParams.get("section");
  const hasScrolled = useRef(false);

  useLayoutEffect(() => {
    if (section && !hasScrolled.current) {
      hasScrolled.current = true;
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        window.history.replaceState(null, "", "/");
      }, 100);
    }
  }, [section]);

  return null;
}