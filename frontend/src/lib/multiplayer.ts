import type { GameStatus } from "@/store/gameStore";

/**
 * PartyKit host. Local dev runs `partykit dev` on :1999; production points at
 * the deployed worker via NEXT_PUBLIC_PARTYKIT_HOST. Multiplayer is additive —
 * if this is unreachable the game still plays solo, the roster just stays empty.
 */
export const PARTYKIT_HOST =
  process.env.NEXT_PUBLIC_PARTYKIT_HOST ?? "127.0.0.1:1999";

/** One player's live progress, mirrored between every client via the room. */
export interface RoomPlayer {
  id: string;
  name: string;
  roundIndex: number;
  totalScore: number;
  status: GameStatus;
}

/** Client → server messages. */
export type RoomClientMessage =
  | { type: "join"; name: string }
  | {
      type: "progress";
      roundIndex: number;
      totalScore: number;
      status: GameStatus;
    };

/** Server → client messages. */
export interface RoomRosterMessage {
  type: "roster";
  players: RoomPlayer[];
}

const ID_KEY = "qaida.player.id";
const NAME_KEY = "qaida.player.name";
const MAX_NAME_LENGTH = 24;

/** Stable per-browser id so reconnects map back to the same roster entry. */
export function getPlayerId(): string {
  try {
    const existing = window.localStorage.getItem(ID_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    window.localStorage.setItem(ID_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function loadPlayerName(): string {
  try {
    return window.localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function savePlayerName(name: string): void {
  try {
    window.localStorage.setItem(NAME_KEY, name.slice(0, MAX_NAME_LENGTH));
  } catch {
    // storage unavailable — name just won't persist between sessions
  }
}

/** Room codes: unambiguous uppercase chars (no 0/O/1/I) for easy sharing. */
const ROOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function newRoomCode(length = 5): string {
  const bytes = crypto.getRandomValues(new Uint32Array(length));
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ROOM_ALPHABET[bytes[i] % ROOM_ALPHABET.length];
  }
  return code;
}

/** Normalize a code from a URL into the canonical form used as the PRNG seed. */
export function normalizeRoomCode(raw: string): string {
  return raw.trim().toUpperCase().slice(0, 12);
}
