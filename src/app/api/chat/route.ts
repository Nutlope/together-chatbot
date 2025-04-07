import { systemPrompt } from "@/lib/utils";
import Together from "together-ai";

const together = new Together();

export async function POST(request: Request) {
  const { messages } = await request.json();

  const res = await together.chat.completions.create({
    model: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
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
