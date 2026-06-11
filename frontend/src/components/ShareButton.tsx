"use client";

import { useState } from "react";
import { MODE_LABELS, type GameMode } from "@/lib/rounds";

interface ShareButtonProps {
  score: number;
  mode: GameMode;
  cities: { name: string; close: boolean }[];
}

function buildShareText({ score, mode, cities }: ShareButtonProps): string {
  const lines = [
    `Qaida — ${MODE_LABELS[mode]}`,
    `Score: ${score.toLocaleString()}`,
    "",
    ...cities.map((c) => `${c.close ? "✓" : "✗"} ${c.name}`),
    "",
    "Can you beat me? Recognize Kazakhstan!",
  ];
  return lines.join("\n");
}

export default function ShareButton(props: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const text = buildShareText(props);
    try {
      if (navigator.share) {
        await navigator.share({ title: "Qaida", text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // user cancelled the share sheet — nothing to do
    }
  };

  return (
    <button
      onClick={share}
      className="rounded-lg border border-gold/60 bg-surface py-3 font-semibold text-gold transition hover:bg-surface-2 active:scale-[0.99]"
    >
      {copied ? "Copied to clipboard" : "Share result"}
    </button>
  );
}
