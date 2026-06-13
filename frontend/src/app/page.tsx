"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LanguageSwitcher, useI18n } from "@/lib/i18n";
import { newRoomCode } from "@/lib/multiplayer";
import type { GameMode } from "@/lib/rounds";

const MODE_ORDER: { mode: GameMode; href: string; gold: boolean }[] = [
  { mode: "daily", href: "/play?mode=daily", gold: true },
  { mode: "quick", href: "/play?mode=quick", gold: false },
  { mode: "infinite", href: "/play?mode=infinite", gold: false },
  { mode: "landmark", href: "/play?mode=landmark", gold: false },
  { mode: "expert", href: "/play?mode=expert", gold: false },
];

export default function Home() {
  const { t } = useI18n();
  const router = useRouter();

  const createRoom = () => router.push(`/room/${newRoomCode()}`);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Cinematic backdrop: Charyn Canyon fading into the steppe night */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/locations/charyn-canyon.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/75 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_110%,rgba(11,17,24,0.9),transparent)]" />
      </div>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pb-10 pt-14 sm:pt-20">
        <div className="mb-8 flex justify-end">
          <LanguageSwitcher />
        </div>

        {/* Hero */}
        <header className="mb-12 space-y-4">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-accent-strong">
            {t.home.eyebrow}
          </p>
          <h1 className="font-display text-7xl font-bold uppercase tracking-tight sm:text-8xl">
            Qaida
          </h1>
          <p className="max-w-md text-xl leading-snug text-sand">
            {t.home.tagline}
          </p>
          <p className="max-w-md text-sm leading-relaxed text-foreground/80">
            {t.home.description}
          </p>
        </header>

        {/* Primary CTA: the daily is the main event */}
        <div className="mb-12 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/play?mode=daily"
            className="flex-1 rounded-xl bg-gold px-6 py-3.5 text-center font-display text-base font-bold text-background shadow-[0_0_24px_rgba(214,168,79,0.35),0_4px_16px_rgba(0,0,0,0.4)] transition hover:brightness-110 active:scale-[0.99]"
          >
            {t.home.daily}
          </Link>
          <Link
            href="/play?mode=quick"
            className="flex-1 rounded-xl border border-accent/60 bg-background/40 px-6 py-3.5 text-center font-display text-base font-bold text-accent-strong backdrop-blur transition hover:border-accent hover:bg-accent/10 active:scale-[0.99]"
          >
            {t.home.start}
          </Link>
          <button
            onClick={createRoom}
            className="flex-1 rounded-xl border border-border-subtle bg-background/40 px-6 py-3.5 text-center font-display text-base font-bold text-foreground backdrop-blur transition hover:border-accent/70 hover:bg-surface/60 active:scale-[0.99]"
          >
            {t.room.title}
          </button>
        </div>

        {/* Mode cards */}
        <section aria-label="Game modes" className="grid gap-3 sm:grid-cols-2">
          {MODE_ORDER.map(({ mode, href, gold }) => (
            <Link
              key={href}
              href={href}
              className={`group rounded-xl border bg-surface/70 p-4 backdrop-blur transition hover:-translate-y-0.5 ${
                gold
                  ? "border-gold/40 hover:border-gold hover:shadow-[0_8px_24px_rgba(214,168,79,0.15)]"
                  : "border-border-subtle hover:border-accent/70 hover:shadow-[0_8px_24px_rgba(0,166,166,0.15)]"
              }`}
            >
              <div className="mb-1 flex items-center justify-between gap-3">
                <span
                  className={`font-display font-bold ${
                    gold ? "text-gold" : "group-hover:text-accent-strong"
                  }`}
                >
                  {t.modes[mode].title}
                </span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ${
                    gold
                      ? "border-gold/40 text-gold"
                      : "border-border-subtle text-muted"
                  }`}
                >
                  {t.modes[mode].tag}
                </span>
              </div>
              <p className="text-sm text-muted">{t.modes[mode].description}</p>
            </Link>
          ))}
          <Link
            href="/leaderboard"
            className="group rounded-xl border border-border-subtle bg-surface/70 p-4 backdrop-blur transition hover:-translate-y-0.5 hover:border-accent/70 hover:shadow-[0_8px_24px_rgba(0,166,166,0.15)]"
          >
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="font-display font-bold group-hover:text-accent-strong">
                {t.home.statsTitle}
              </span>
              <span className="rounded-full border border-border-subtle px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-muted">
                {t.home.statsTag}
              </span>
            </div>
            <p className="text-sm text-muted">{t.home.statsDescription}</p>
          </Link>
        </section>

        <footer className="mt-auto pt-12 text-xs text-muted/80">
          Imagery: Google Street View / Wikimedia Commons · Map: ©
          OpenStreetMap contributors
        </footer>
      </main>
    </div>
  );
}
