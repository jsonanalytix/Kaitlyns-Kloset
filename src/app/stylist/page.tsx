"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Bookmark,
  Send,
  Heart,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import {
  initialChatMessages,
  chatOutfits,
  quickChips,
  getItemsForOutfit,
  type ChatMessage,
  type StylistOutfit,
} from "@/data/stylist";

export default function StylistPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      type: "text",
      content: messageText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: "ai",
        type: "text",
        content:
          "I love that idea! Let me look through your wardrobe and put something together for you. Give me just a moment\u2026 \u2728",
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1200);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Stylist sub-header */}
      <div className="flex shrink-0 items-center justify-between border-b border-warm-200 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blush-100 to-blush-200">
            <Sparkles className="h-4 w-4 text-blush-500" />
          </div>
          <h1 className="text-base font-semibold text-warm-900">AI Stylist</h1>
        </div>
        <Link
          href="/stylist/saved"
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-blush-500 transition-colors hover:bg-blush-50"
        >
          <Bookmark className="h-4 w-4" />
          Saved
        </Link>
      </div>

      {/* Messages thread */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((msg) => {
          if (msg.sender === "user") {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-blush-500 px-4 py-2.5 text-sm leading-relaxed text-white">
                  {msg.content}
                </div>
              </div>
            );
          }

          if (msg.type === "outfit" && msg.outfitId && chatOutfits[msg.outfitId]) {
            return (
              <OutfitSuggestionCard
                key={msg.id}
                outfit={chatOutfits[msg.outfitId]}
              />
            );
          }

          return (
            <div key={msg.id} className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-warm-100 px-4 py-2.5 text-sm leading-relaxed text-warm-800">
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-warm-200 bg-surface px-4 pt-3 lg:pb-4" style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom, 0px))" }}>
        <div className="mx-auto max-w-3xl">
          {/* Quick context chips */}
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {quickChips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleSend(chip.message)}
                className="shrink-0 rounded-full border border-warm-200 bg-warm-50 px-3.5 py-1.5 text-xs font-medium text-warm-600 transition-colors hover:border-blush-300 hover:bg-blush-50 hover:text-blush-600"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Text input + send */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Describe your occasion, mood, or ask for ideas..."
              className="flex-1 rounded-xl border border-warm-200 bg-background py-2.5 pl-4 pr-4 text-base sm:text-sm text-warm-800 placeholder:text-warm-400 focus:border-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-100"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blush-500 text-white transition-all hover:bg-blush-600 active:scale-95 disabled:opacity-40 disabled:hover:bg-blush-500"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OutfitSuggestionCard({ outfit }: { outfit: StylistOutfit }) {
  const items = getItemsForOutfit(outfit.itemIds);
  const [saved, setSaved] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  return (
    <div className="flex justify-start">
      <div className="w-full max-w-[88%] overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-warm-200/60">
        {/* Card header */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-blush-400" />
            <span className="text-sm font-semibold text-warm-900">
              {outfit.name}
            </span>
            <span className="rounded-full bg-blush-50 px-2 py-0.5 text-[10px] font-medium text-blush-500">
              {outfit.occasion}
            </span>
          </div>
        </div>

        {/* Item thumbnail row */}
        <div className="flex gap-px bg-warm-100">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square flex-1 bg-warm-50"
            >
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                sizes="100px"
              />
            </div>
          ))}
        </div>

        {/* Explanation + actions */}
        <div className="p-4">
          <p className="text-xs leading-relaxed text-warm-500">
            {outfit.explanation}
          </p>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {items.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 rounded-full bg-warm-50 px-2 py-0.5 text-[10px] font-medium text-warm-600"
              >
                <span
                  className="h-2 w-2 rounded-full ring-1 ring-warm-200"
                  style={{ backgroundColor: item.colorHex }}
                />
                {item.name}
              </span>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-1.5 border-t border-warm-100 pt-3">
            <button
              onClick={() => setSaved(!saved)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                saved
                  ? "bg-blush-50 text-blush-500"
                  : "text-warm-500 hover:bg-warm-50"
              }`}
            >
              <Heart
                className={`h-3.5 w-3.5 ${saved ? "fill-blush-500" : ""}`}
              />
              {saved ? "Saved" : "Save"}
            </button>
            <button className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-warm-500 transition-colors hover:bg-warm-50">
              <RefreshCw className="h-3.5 w-3.5" />
              Try another
            </button>
            <div className="ml-auto flex items-center gap-0.5">
              <button
                onClick={() => setFeedback(feedback === "up" ? null : "up")}
                className={`rounded-lg p-1.5 transition-colors ${
                  feedback === "up"
                    ? "bg-blush-50 text-blush-500"
                    : "text-warm-400 hover:bg-warm-50 hover:text-warm-600"
                }`}
              >
                <ThumbsUp
                  className={`h-3.5 w-3.5 ${feedback === "up" ? "fill-blush-500" : ""}`}
                />
              </button>
              <button
                onClick={() =>
                  setFeedback(feedback === "down" ? null : "down")
                }
                className={`rounded-lg p-1.5 transition-colors ${
                  feedback === "down"
                    ? "bg-warm-200 text-warm-700"
                    : "text-warm-400 hover:bg-warm-50 hover:text-warm-600"
                }`}
              >
                <ThumbsDown
                  className={`h-3.5 w-3.5 ${feedback === "down" ? "fill-warm-700" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
