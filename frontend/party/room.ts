import type * as Party from "partykit/server";

/**
 * Qaida multiplayer room. One PartyKit room == one invite link. The server is a
 * thin relay: it holds the live roster of players and rebroadcasts it whenever
 * anyone joins, makes progress, or leaves. Round selection is deterministic on
 * the client (seeded by the room code), so no game data flows through here.
 *
 * Scores are client-reported — fine for playing with friends, not a ranked
 * ladder. State lives in memory; the room stays warm while anyone is connected.
 */

type PlayerStatus = "idle" | "guessing" | "result" | "finished";

interface Player {
  id: string;
  name: string;
  roundIndex: number;
  totalScore: number;
  status: PlayerStatus;
}

const MAX_NAME_LENGTH = 24;
const VALID_STATUSES: ReadonlySet<PlayerStatus> = new Set([
  "idle",
  "guessing",
  "result",
  "finished",
]);

function toStatus(value: unknown): PlayerStatus {
  return typeof value === "string" && VALID_STATUSES.has(value as PlayerStatus)
    ? (value as PlayerStatus)
    : "guessing";
}

function toFiniteNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export default class RoomServer implements Party.Server {
  private players = new Map<string, Player>();

  constructor(readonly room: Party.Room) {}

  onConnect(connection: Party.Connection): void {
    // New arrivals see whoever is already in the room immediately.
    connection.send(this.roster());
  }

  onMessage(message: string | ArrayBuffer, sender: Party.Connection): void {
    if (typeof message !== "string") return;

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(message) as Record<string, unknown>;
    } catch {
      return; // ignore malformed input
    }

    if (payload.type === "join") {
      const name = String(payload.name ?? "")
        .trim()
        .slice(0, MAX_NAME_LENGTH);
      this.players.set(sender.id, {
        id: sender.id,
        name: name || "Player",
        roundIndex: 0,
        totalScore: 0,
        status: "guessing",
      });
    } else if (payload.type === "progress") {
      const existing = this.players.get(sender.id);
      if (!existing) return; // progress before join — ignore
      this.players.set(sender.id, {
        ...existing,
        roundIndex: toFiniteNumber(payload.roundIndex),
        totalScore: toFiniteNumber(payload.totalScore),
        status: toStatus(payload.status),
      });
    } else {
      return;
    }

    this.room.broadcast(this.roster());
  }

  onClose(connection: Party.Connection): void {
    if (this.players.delete(connection.id)) {
      this.room.broadcast(this.roster());
    }
  }

  private roster(): string {
    return JSON.stringify({
      type: "roster",
      players: [...this.players.values()],
    });
  }
}
