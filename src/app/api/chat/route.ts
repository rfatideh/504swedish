import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  gateway,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import {
  buildSystemPrompt,
  DEFAULT_MODE,
  GATEWAY_MODEL,
  type TutorMode,
} from "@/lib/tutor";
import { getLessonContext } from "@/lib/tutorContext";

export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    mode,
    lessonIndex,
  }: { messages: UIMessage[]; mode?: TutorMode; lessonIndex?: number } =
    await req.json();

  const lessonContext =
    typeof lessonIndex === "number" ? getLessonContext(lessonIndex) : undefined;
  const system = buildSystemPrompt(mode ?? DEFAULT_MODE, lessonContext);

  const result = streamText({
    model: gateway(GATEWAY_MODEL),
    system,
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
