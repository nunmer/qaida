"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

interface ShareButtonProps {
  score: number;
  distancesKm: number[];
  /** Overrides the default solo text — used for the multiplayer summary. */
  text?: string;
}

/** Full URL (with scheme) so pasted shares auto-linkify in chat apps. */
export const SHARE_URL = `https://${SITE_URL}`;

function formatShareDistance(km: number): string {
  return km < 1 ? "<1km" : `${Math.round(km)}km`;
}

/** Wordle-style tier dot: how close the guess was. */
function distanceEmoji(km: number): string {
  if (km < 1) return "🎯";
  if (km < 100) return "🟢";
  if (km < 500) return "🟡";
  return "🔴";
}

function buildShareText(
  score: number,
  distancesKm: number[],
  catchphrase: string,
): string {
  return [
    "Qaida 🇰🇿",
    `🏆 ${score.toLocaleString("en-US")}`,
    ...distancesKm.map(
      (km, i) => `${distanceEmoji(km)} ${i + 1}. ${formatShareDistance(km)}`,
    ),
    "",
    catchphrase,
    "",
    SHARE_URL,
  ].join("\n");
}

const SOCIAL_TARGETS = [
  {
    name: "Telegram",
    url: (text: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(`https://${SITE_URL}`)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: "WhatsApp",
    url: (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`,
  },
  {
    name: "X",
    url: (text: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
  },
] as const;

export default function ShareButton({
  score,
  distancesKm,
  text: textOverride,
}: ShareButtonProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  // navigator only exists client-side; checking after mount avoids hydration mismatch
  useEffect(() => {
    setCanNativeShare(typeof navigator.share === "function");
  }, []);

  const text =
    textOverride ?? buildShareText(score, distancesKm, t.share.catchphrase);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — the social buttons still work
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: "Qaida", text });
    } catch {
      // user cancelled the share sheet — nothing to do
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={copy}
        className="rounded-xl border border-gold/60 bg-surface py-3 font-display font-bold text-gold transition hover:bg-gold/10 active:scale-[0.99]"
      >
        {copied ? t.share.copied : t.share.copy}
      </button>
      <div className="flex gap-2">
        {SOCIAL_TARGETS.map((target) => (
          <a
            key={target.name}
            href={target.url(text)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-xl border border-border-subtle bg-surface/80 py-2 text-center text-sm font-medium text-muted backdrop-blur transition hover:border-accent/60 hover:text-foreground"
          >
            {target.name}
          </a>
        ))}
        {canNativeShare && (
          <button
            onClick={nativeShare}
            className="flex-1 rounded-xl border border-border-subtle bg-surface/80 py-2 text-center text-sm font-medium text-muted backdrop-blur transition hover:border-accent/60 hover:text-foreground"
          >
            {t.share.share}
          </button>
        )}
      </div>
    </div>
  );
}
