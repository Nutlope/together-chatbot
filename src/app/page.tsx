"use client";

import { FormEvent, useState } from "react";
import Together from "together-ai";
import { ChatCompletionStream } from "together-ai/lib/ChatCompletionStream";
import Markdown from "react-markdown";

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<
    Together.Chat.Completions.CompletionCreateParams.Message[]
  >([]);
  const [isPending, setIsPending] = useState(false);

  const suggestions = [
    {
      title: "What are the advantages",
      subtitle: "of using Next.js?",
    },
    {
      title: "Write code to",
      subtitle: "demonstrate dijkstra's algorithm",
    },
    {
      title: "Help me write an essay",
      subtitle: "about silicon valley",
    },
    {
      title: "What is the weather",
      subtitle: "in San Francisco?",
    },
  ];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setPrompt("");
    setIsPending(true);
    setMessages((messages) => [
      ...messages,
      {
        role: "user",
        content: prompt,
      },
    ]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          ...messages,
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!res.body) return;

    ChatCompletionStream.fromReadableStream(res.body)
      .on("content", (delta, content) => {
        setMessages((messages) => {
          const lastMessage = messages.at(-1);

          if (lastMessage?.role !== "assistant") {
            return [...messages, { role: "assistant", content }];
          } else {
            return [...messages.slice(0, -1), { ...lastMessage, content }];
          }
        });
      })
      .on("end", () => {
        setIsPending(false);
      });
  }

  return (
    <>
      <div className="flex h-0 grow flex-col-reverse overflow-y-scroll">
        <div className="space-y-4 py-8">
          {messages.map((message, i) => (
            <div key={i} className="mx-auto flex max-w-3xl">
              {message.role === "user" ? (
                <div className="ml-auto rounded-full bg-blue-500 px-4 py-2 text-white">
                  {message.content}
                </div>
              ) : (
                <div className="prose">
                  <Markdown>{message.content}</Markdown>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mb-8 grid w-full max-w-3xl grid-cols-2 gap-4">
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            className="rounded-xl border p-4 text-left hover:bg-gray-50"
            onClick={() =>
              setPrompt(suggestion.title + " " + suggestion.subtitle)
            }
          >
            <div className="font-medium">{suggestion.title}</div>
            <div className="text-gray-600">{suggestion.subtitle}</div>
          </button>
        ))}
      </div>
      <div className="mb-8 flex justify-center gap-2">
        <form onSubmit={handleSubmit} className="flex w-full max-w-3xl">
          <fieldset className="flex w-full gap-2">
            <textarea
              rows={4}
              autoFocus
              placeholder="I want to build a..."
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="block w-full rounded border border-gray-300 p-2 outline-black"
            />
            <button
              className="rounded bg-black px-3 py-1 font-medium text-white outline-offset-[3px] outline-black disabled:opacity-50"
              type="submit"
              disabled={isPending}
            >
              Submit
            </button>
          </fieldset>
        </form>
      </div>
    </>
  );
}
