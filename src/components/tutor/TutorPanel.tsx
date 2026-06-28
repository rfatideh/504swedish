// No "use client" directive: this panel is only rendered inside TutorWidget
// (a Client Component), so it is already on the client. Adding the directive
// would make it a client entry point and wrongly flag the onClose function prop
// as a non-serializable Server Action boundary crossing.
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_MODE, TUTOR_MODES, type TutorMode } from "@/lib/tutor";
import { ChatMessage } from "./ChatMessage";

const MODE_KEY = "504sv:tutorMode";

export function TutorPanel({ onClose }: { onClose: () => void }) {
  // Keep a single transport instance stable across renders.
  const transportRef = useRef<DefaultChatTransport<UIMessage> | null>(null);
  if (transportRef.current === null) {
    transportRef.current = new DefaultChatTransport<UIMessage>({
      api: "/api/chat",
    });
  }

  const { messages, sendMessage, status, error, stop } = useChat({
    transport: transportRef.current,
  });

  const [mode, setMode] = useState<TutorMode>(DEFAULT_MODE);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // Restore the saved mode on mount.
  useEffect(() => {
    const saved = localStorage.getItem(MODE_KEY) as TutorMode | null;
    if (saved && TUTOR_MODES.some((m) => m.id === saved)) {
      setMode(saved);
    }
  }, []);

  // Keep the view pinned to the newest message. The `messages` reference
  // changes both when a message is sent and as tokens stream in, so it alone
  // covers every case that should trigger a scroll.
  useEffect(() => {
    if (messages.length === 0) return;
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const busy = status === "submitted" || status === "streaming";

  function changeMode(next: TutorMode) {
    setMode(next);
    localStorage.setItem(MODE_KEY, next);
  }

  function send() {
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text }, { body: { mode } });
    setInput("");
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex items-center gap-2 bg-[#006AA7] px-4 py-3 text-white">
        <span className="font-semibold">Svensk&nbsp;tutor</span>
        <select
          aria-label="Tutor style"
          value={mode}
          onChange={(e) => changeMode(e.target.value as TutorMode)}
          className="ml-auto rounded-md bg-white/15 px-2 py-1 text-xs text-white outline-none"
        >
          {TUTOR_MODES.map((m) => (
            <option key={m.id} value={m.id} className="text-zinc-900">
              {m.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close tutor"
          className="rounded-md px-2 py-1 text-lg leading-none hover:bg-white/15"
        >
          ✕
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="mt-8 text-center text-sm text-zinc-400">
            Hej! 👋 Ask me anything about Swedish words, grammar, or this
            lesson.
          </p>
        )}
        <div className="space-y-3">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}
          {status === "submitted" && (
            <p className="text-sm text-zinc-400">Tänker…</p>
          )}
          {error && (
            <p className="text-sm text-red-600">
              Something went wrong. Please try again.
            </p>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex items-end gap-2 border-t border-zinc-200 p-3"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={1}
          placeholder="Skriv ett meddelande…"
          className="max-h-32 flex-1 resize-none rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-[#006AA7]"
        />
        {busy ? (
          <button
            type="button"
            onClick={stop}
            className="rounded-xl bg-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-xl bg-[#006AA7] px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}
