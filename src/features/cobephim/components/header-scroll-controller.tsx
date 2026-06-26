"use client";

import { useEffect } from "react";

export function HeaderScrollController() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header='true']");

    if (!header) {
      return;
    }

    const syncHeaderState = () => {
      const isFixed = window.scrollY > 24;

      header.classList.toggle("fixed", isFixed);
      header.classList.toggle("fly", !isFixed);
    };

    syncHeaderState();
    window.addEventListener("scroll", syncHeaderState, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncHeaderState);
    };
  }, []);

  return null;
}
