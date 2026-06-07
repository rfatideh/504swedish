// No "use client" directive: this component is only rendered inside
// DictionaryProvider (a Client Component), so it's already on the client side.
// Adding the directive would make it a client entry point and wrongly flag the
// onClose function prop as a non-serializable Server Action boundary crossing.
import { useEffect, useRef, useState } from "react";
import { DICTIONARIES, type DictId } from "./dictionaries";

export function DictionaryModal({
  word,
  onClose,
}: {
  word: string;
  onClose: () => void;
}) {
  const [activeId, setActiveId] = useState<DictId>(DICTIONARIES[0].id);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape and lock body scroll while the modal is open.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const active = DICTIONARIES.find((d) => d.id === activeId) ?? DICTIONARIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dictionary"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/40"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Dictionary lookup: ${word}`}
        tabIndex={-1}
        className="relative flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl outline-none"
      >
        <header className="flex items-center justify-between border-b border-zinc-200 px-5 py-3">
          <h2 className="text-lg font-bold text-zinc-900">{word}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          >
            ×
          </button>
        </header>

        <nav className="flex gap-1 border-b border-zinc-200 px-3">
          {DICTIONARIES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActiveId(d.id)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                d.id === activeId
                  ? "border-[#006AA7] text-[#006AA7]"
                  : "border-transparent text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {d.label}
            </button>
          ))}
        </nav>

        <div className="min-h-0 flex-1 bg-zinc-50">
          {active.mode === "iframe" ? (
            <iframe
              key={`${active.id}-${word}`}
              src={active.buildUrl(word)}
              title={`${active.label}: ${word}`}
              className="h-full w-full border-0 bg-white"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <p className="max-w-sm text-sm text-zinc-500">
                {active.label} can&apos;t be embedded here, so it opens in a new
                tab.
              </p>
              <a
                href={active.buildUrl(word)}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-[#006AA7] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#005a8f]"
              >
                Open “{word}” in {active.label} ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
