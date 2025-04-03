"use client";

import { FormEvent, useState } from "react";
import Together from "together-ai";
import { ChatCompletionStream } from "together-ai/lib/ChatCompletionStream";
import Markdown from "react-markdown";
import {
  PaperAirplaneIcon,
  CommandLineIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<
    Together.Chat.Completions.CompletionCreateParams.Message[]
  >([]);
  const [isPending, setIsPending] = useState(false);

  const suggestions = [
    {
      title: "How can I build an app that parses PDFs",
      subtitle: "and can extract key things from them?",
    },
    {
      title: "I want to build a voice agent",
      subtitle: "that my customers can call for support",
    },
    {
      title: "How do I build a workflow that can summarize",
      subtitle: "my emails and send me a daily digest?",
    },
    {
      title: "How do I build an open source Perplexity",
      subtitle: "clone with a search API?",
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
      <div className="flex h-0 grow flex-col overflow-y-scroll">
        {messages.length === 0 && (
          <motion.div
            key="overview"
            className="mx-auto max-w-3xl md:mt-20"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex max-w-xl flex-col gap-8 rounded-xl p-6 text-center leading-relaxed">
              <p className="flex flex-row items-center justify-center gap-4">
                <CommandLineIcon className="h-8 w-8" />
                <span>+</span>
                <ChatBubbleBottomCenterTextIcon className="h-8 w-8" />
              </p>
              <p>
                This is a chatbot by{" "}
                <Link
                  className="font-medium underline underline-offset-4"
                  href="https://together.ai"
                  target="_blank"
                >
                  Together AI
                </Link>{" "}
                that can guide you through how to solve problems with Together
                AI, from general architecture and what APIs you should use down
                to which LLM you should use for a specific use case.
              </p>
              <p>
                You can learn more about the Together AI by visiting our{" "}
                <Link
                  className="font-medium underline underline-offset-4"
                  href="https://docs.together.ai/"
                  target="_blank"
                >
                  docs
                </Link>
                .
              </p>
            </div>
          </motion.div>
        )}
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

      <div className="mx-auto mb-8 hidden w-full max-w-3xl grid-cols-2 gap-4 md:grid">
        {messages.length === 0 &&
          suggestions.map((suggestion, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: i * 0.1,
                ease: "easeOut",
              }}
              className="rounded-xl border p-4 text-left hover:bg-gray-50"
              onClick={() =>
                setPrompt(suggestion.title + " " + suggestion.subtitle)
              }
            >
              <div className="font-medium">{suggestion.title}</div>
              <div className="text-gray-600">{suggestion.subtitle}</div>
            </motion.button>
          ))}
      </div>
      <div className="mb-8 flex justify-center gap-2">
        <form onSubmit={handleSubmit} className="flex w-full max-w-3xl">
          <fieldset className="relative flex w-full">
            <textarea
              rows={4}
              autoFocus
              placeholder="I want to build a..."
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="block w-full rounded-xl border border-gray-300 bg-gray-100 p-2 pr-12 outline-black"
            />
            <button
              type="submit"
              disabled={isPending}
              className="absolute bottom-2 right-2 rounded-full p-2 text-black hover:bg-gray-100 disabled:opacity-50"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </fieldset>
        </form>
      </div>
    </>
  );
}
