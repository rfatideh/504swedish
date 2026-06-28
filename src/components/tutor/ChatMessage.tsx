// No "use client" directive: this component is only rendered inside TutorPanel,
// which is reached from TutorWidget (a Client Component), so it is already on
// the client. Adding the directive would make it a separate client entry point.
import { isTextUIPart, type UIMessage } from "ai";
import { SwedishText } from "@/components/dictionary/SwedishText";

export function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = message.parts
    .filter(isTextUIPart)
    .map((part) => part.text)
    .join("");

  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-[#006AA7] text-white"
            : "rounded-bl-sm bg-zinc-100 text-zinc-800"
        }`}
      >
        {isUser ? text : <SwedishText>{text}</SwedishText>}
      </div>
    </div>
  );
}
