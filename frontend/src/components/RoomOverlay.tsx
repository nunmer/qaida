"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import usePartySocket from "partysocket/react";
import { useI18n } from "@/lib/i18n";
import {
  PARTY_HOST,
  PARTY_NAME,
  getPlayerId,
  loadPlayerName,
  type RoomPlayer,
  type RoomRosterMessage,
} from "@/lib/multiplayer";
import { useGameStore } from "@/store/gameStore";
import { useRoomStore } from "@/store/roomStore";

/**
 * Owns the multiplayer socket: publishes this player's progress whenever the
 * local game advances, and mirrors the roster into the shared room store. While
 * playing it renders a floating opponents panel (with a flash when someone
 * lands a guess). On the finished screen it renders nothing — final standings
 * move into the summary so they can't overlap the score.
 */
export default function RoomOverlay({ roomCode }: { roomCode: string }) {
  const { t } = useI18n();
  const selfId = useMemo(() => getPlayerId(), []);
  const selfName = useMemo(() => loadPlayerName() || "Player", []);

  const enter = useRoomStore((s) => s.enter);
  const leave = useRoomStore((s) => s.leave);
  const setRoster = useRoomStore((s) => s.setRoster);
  const roster = useRoomStore((s) => s.roster);

  const roundIndex = useGameStore((s) => s.roundIndex);
  const totalScore = useGameStore((s) => s.totalScore);
  const status = useGameStore((s) => s.status);

  useEffect(() => {
    enter(selfId);
    return () => leave();
  }, [selfId, enter, leave]);

  const socket = usePartySocket({
    host: PARTY_HOST,
    party: PARTY_NAME,
    room: roomCode,
    id: selfId,
    onOpen() {
      socket.send(JSON.stringify({ type: "join", name: selfName }));
    },
    onMessage(event) {
      try {
        const data = JSON.parse(event.data as string) as RoomRosterMessage;
        if (data.type === "roster") setRoster(data.players);
      } catch {
        // ignore malformed roster
      }
    },
  });

  // Publish local progress on every change. send() is buffered by partysocket
  // until the connection opens, so early calls are safe.
  useEffect(() => {
    try {
      socket.send(
        JSON.stringify({ type: "progress", roundIndex, totalScore, status }),
      );
    } catch {
      // not connected yet — the next change (or reconnect) will resync
    }
  }, [socket, roundIndex, totalScore, status]);

  const selfRow: RoomPlayer = {
    id: selfId,
    name: selfName,
    roundIndex,
    totalScore,
    status,
  };
  const players = [
    selfRow,
    ...roster.filter((p) => p.id !== selfId),
  ].sort((a, b) => b.totalScore - a.totalScore);

  const flashing = useGuessFlash(players);

  // Standings live in the summary once the game is over (avoids overlapping it).
  if (status === "finished") return null;

  return (
    <aside className="fixed left-2 top-13 z-30 w-44 overflow-hidden rounded-xl border border-border-subtle bg-surface/90 text-xs shadow-xl backdrop-blur sm:w-52">
      <div className="flex items-center justify-between gap-2 border-b border-border-subtle px-3 py-2">
        <span className="font-display font-bold uppercase tracking-wider text-muted">
          {t.room.players}
        </span>
        <InviteButton />
      </div>
      <ul className="divide-y divide-border-subtle/60">
        {players.map((player) => (
          <li
            key={player.id}
            className={`flex items-center justify-between gap-2 px-3 py-2 ${
              flashing.has(player.id) ? "animate-guess-flash" : ""
            }`}
          >
            <span className="min-w-0 flex-1 truncate font-medium">
              {player.name}
              {player.id === selfId && (
                <span className="ml-1 text-muted">({t.room.you})</span>
              )}
            </span>
            <span className="flex shrink-0 items-center gap-2 tabular-nums">
              <ProgressBadge player={player} />
              <span className="font-display font-bold">
                {player.totalScore.toLocaleString()}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/** Returns the set of player ids whose score just increased (flash for ~1s). */
function useGuessFlash(players: RoomPlayer[]): Set<string> {
  const prevScores = useRef<Record<string, number>>({});
  const [flashing, setFlashing] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newly: string[] = [];
    for (const p of players) {
      const prev = prevScores.current[p.id];
      if (prev !== undefined && p.totalScore > prev) newly.push(p.id);
      prevScores.current[p.id] = p.totalScore;
    }
    if (newly.length === 0) return;

    setFlashing((curr) => {
      const next = new Set(curr);
      for (const id of newly) next.add(id);
      return next;
    });
    const timer = setTimeout(() => {
      setFlashing((curr) => {
        const next = new Set(curr);
        for (const id of newly) next.delete(id);
        return next;
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [players]);

  return flashing;
}

function ProgressBadge({ player }: { player: RoomPlayer }) {
  const { t } = useI18n();
  if (player.status === "finished") {
    return (
      <span className="rounded-full border border-gold/40 bg-gold/10 px-1.5 py-0.5 text-[0.6rem] font-semibold text-gold">
        ✓ {t.room.finished}
      </span>
    );
  }
  return (
    <span className="rounded-full border border-border-subtle px-1.5 py-0.5 text-[0.6rem] font-semibold text-muted">
      {Math.min(player.roundIndex + 1, 5)}/5
    </span>
  );
}

function InviteButton() {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    try {
      void navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked — the URL is still in the address bar
    }
  }, []);

  return (
    <button
      onClick={copy}
      className="rounded-md border border-accent/50 px-1.5 py-0.5 text-[0.6rem] font-semibold text-accent-strong transition hover:bg-accent/10"
    >
      {copied ? t.room.copied : t.room.invite}
    </button>
  );
}
