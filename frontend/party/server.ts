import { Server, routePartykitRequest, type Connection } from "partyserver";

/**
 * Qaida multiplayer room on Cloudflare Workers + Durable Objects (partyserver,
 * PartyKit's successor). One Durable Object instance == one invite link. The
 * server is a thin relay: each connection stores its own player state, and the
 * full roster is rebroadcast whenever anyone joins, makes progress, or leaves.
 *
 * Round selection is deterministic on the client (seeded by the room code), so
 * no game data flows through here. Per-connection state is held on the
 * connection (survives DO hibernation); scores are client-reported — fine for
 * playing with friends, not a ranked ladder.
 */

interface Env {
  Room: DurableObjectNamespace;
}

type PlayerStatus = "idle" | "guessing" | "result" | "finished";

interface Player {
  id: string;
  name: string;
  roundIndex: number;
  totalScore: number;
  status: PlayerStatus;
}

const MAX_NAME_LENGTH = 24;
const VALID_STATUSES: ReadonlySet<string> = new Set([
  "idle",
  "guessing",
  "result",
  "finished",
]);

const toStatus = (value: unknown): PlayerStatus =>
  typeof value === "string" && VALID_STATUSES.has(value)
    ? (value as PlayerStatus)
    : "guessing";

const toFiniteNumber = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export class Room extends Server<Env> {
  onConnect(connection: Connection): void {
    // New arrivals see whoever has already joined.
    connection.send(this.roster());
  }

  onMessage(connection: Connection, message: string | ArrayBuffer): void {
    if (typeof message !== "string") return;

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(message) as Record<string, unknown>;
    } catch {
      return; // ignore malformed input
    }

    if (payload.type === "join") {
      const name =
        String(payload.name ?? "").trim().slice(0, MAX_NAME_LENGTH) || "Player";
      const player: Player = {
        id: connection.id,
        name,
        roundIndex: 0,
        totalScore: 0,
        status: "guessing",
      };
      connection.setState(player);
    } else if (payload.type === "progress") {
      const prev = connection.state as Player | null;
      if (!prev) return; // progress before join — ignore
      connection.setState({
        ...prev,
        roundIndex: toFiniteNumber(payload.roundIndex),
        totalScore: toFiniteNumber(payload.totalScore),
        status: toStatus(payload.status),
      });
    } else {
      return;
    }

    this.broadcast(this.roster());
  }

  onClose(): void {
    // The closed connection is already gone from getConnections().
    this.broadcast(this.roster());
  }

  private roster(): string {
    const players: Player[] = [];
    for (const conn of this.getConnections()) {
      const state = conn.state as Player | null;
      if (state) players.push(state);
    }
    return JSON.stringify({ type: "roster", players });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return (
      (await routePartykitRequest(request, env)) ||
      new Response("Not Found", { status: 404 })
    );
  },
};
