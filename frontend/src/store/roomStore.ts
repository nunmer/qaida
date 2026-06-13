import { create } from "zustand";
import type { RoomPlayer } from "@/lib/multiplayer";

/**
 * Shared multiplayer roster, written by RoomOverlay (which owns the socket) and
 * read by the game summary so it can show final standings inline — the floating
 * in-game panel would otherwise overlap the score on the finished screen.
 */
interface RoomStore {
  active: boolean;
  selfId: string | null;
  roster: RoomPlayer[];
  enter: (selfId: string) => void;
  setRoster: (roster: RoomPlayer[]) => void;
  leave: () => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  active: false,
  selfId: null,
  roster: [],
  enter: (selfId) => set({ active: true, selfId }),
  setRoster: (roster) => set({ roster }),
  leave: () => set({ active: false, selfId: null, roster: [] }),
}));
