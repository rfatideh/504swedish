"use client";
import { useEffect, useState } from "react";
import { TutorPanel } from "./TutorPanel";

export function TutorWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open Swedish tutor"
        className="fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#006AA7] text-2xl text-white shadow-lg transition-transform hover:scale-105"
      >
        💬
      </button>
    );
  }

  return (
    <>
      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="Close tutor"
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-40 cursor-default bg-black/30 sm:hidden"
      />
      {/* Desktop card / mobile bottom sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 h-[80vh] overflow-hidden rounded-t-2xl shadow-2xl ring-1 ring-black/5 sm:inset-auto sm:right-5 sm:bottom-5 sm:h-[560px] sm:w-[380px] sm:rounded-2xl">
        <TutorPanel onClose={() => setOpen(false)} />
      </div>
    </>
  );
}
