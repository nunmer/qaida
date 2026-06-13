"use client";

import { useState } from "react";
import GameView from "@/components/GameView";
import RoomJoin from "@/components/RoomJoin";

/** A multiplayer room: lobby first (name + invite), then the seeded game. */
export default function RoomGame({ code }: { code: string }) {
  const [joined, setJoined] = useState(false);

  if (!joined) {
    return <RoomJoin code={code} onJoin={() => setJoined(true)} />;
  }
  return <GameView mode="room" roomCode={code} />;
}
