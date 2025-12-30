import { systemPrompt } from "@/lib/utils";
import Together from "together-ai";

const together = new Together();

export async function POST(request: Request) {
  const { messages } = await request.json();

  const res = await together.chat.completions.create({
    model: "moonshotai/Kimi-K2-Instruct-0905",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages,
    ],
    stream: true,
  });

  return new Response(res.toReadableStream());
}
