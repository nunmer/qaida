import RoomGame from "@/components/RoomGame";
import { normalizeRoomCode } from "@/lib/multiplayer";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <RoomGame code={normalizeRoomCode(code)} />;
}
