"use client";

import { useState } from "react";
import { useSettings } from "./settings/SettingsProvider";

export function Translation({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const { alwaysShowTranslations } = useSettings();
  const [revealed, setRevealed] = useState(false);

  if (alwaysShowTranslations) {
    return <span className={className}>{children}</span>;
  }

  return (
    <button
      type="button"
      onClick={() => setRevealed((prev) => !prev)}
      aria-label={revealed ? "Hide translation" : "Show translation"}
      className={`cursor-pointer text-left transition ${
        revealed ? "" : "select-none blur-sm hover:blur-[0px]"
      } ${className}`}
    >
      {children}
    </button>
  );
}
