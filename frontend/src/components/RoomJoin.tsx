"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LanguageSwitcher, useI18n } from "@/lib/i18n";
import { loadPlayerName, savePlayerName } from "@/lib/multiplayer";

/**
 * Lobby shown before a player enters a room: pick a display name and grab the
 * invite link to share. The room code in the URL is all anyone needs to join.
 */
export default function RoomJoin({
  code,
  onJoin,
}: {
  code: string;
  onJoin: () => void;
}) {
  const { t } = useI18n();
  // Load the saved name after mount — reading localStorage during render
  // causes a server/client hydration mismatch that can leave the submit button
  // stuck disabled until the field is edited.
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = loadPlayerName();
    if (stored) setName(stored);
  }, []);

  const join = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    savePlayerName(trimmed);
    onJoin();
  };

  const copyLink = () => {
    try {
      void navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked — the URL is still in the address bar
    }
  };

  return (
    <div className="bg-sky-gradient flex min-h-dvh w-full flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 p-6">
        <div className="flex justify-end pt-2">
          <LanguageSwitcher />
        </div>

        <header className="space-y-2 pt-6 text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent-strong">
            {t.room.title}
          </p>
          <h1 className="font-display text-4xl font-bold tracking-wider text-gold">
            {code}
          </h1>
          <p className="text-sm text-muted">{t.room.subtitle}</p>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            join();
          }}
          className="flex flex-col gap-3"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.room.namePlaceholder}
            maxLength={24}
            autoFocus
            className="rounded-xl border border-border-subtle bg-surface/80 px-4 py-3 text-center font-medium outline-none backdrop-blur focus:border-accent"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="shadow-accent-glow rounded-xl bg-accent py-3 font-display font-bold text-background transition hover:bg-accent-strong active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t.room.join}
          </button>
        </form>

        <button
          onClick={copyLink}
          className="rounded-xl border border-border-subtle bg-surface/80 py-3 text-center font-medium backdrop-blur transition hover:border-accent/70"
        >
          {copied ? t.room.copied : t.room.invite}
        </button>

        <Link
          href="/"
          className="mt-auto pb-2 text-center text-sm text-muted hover:text-foreground"
        >
          {t.play.home}
        </Link>
      </div>
    </div>
  );
}
