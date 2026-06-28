import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  gateway,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import {
  DEFAULT_MODE,
  GATEWAY_MODEL,
  SYSTEM_PROMPTS,
  type TutorMode,
} from "@/lib/tutor";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, mode }: { messages: UIMessage[]; mode?: TutorMode } =
    await req.json();

  const system =
    SYSTEM_PROMPTS[mode ?? DEFAULT_MODE] ?? SYSTEM_PROMPTS[DEFAULT_MODE];

  const result = streamText({
    model: gateway(GATEWAY_MODEL),
    system,
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
