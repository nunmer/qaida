// Smoke test for the room relay (partyserver): two clients join one room, one
// makes progress, and we assert both appear in the broadcast roster with live
// data. Run `npm run party:dev` first (wrangler dev on :8787).
import { PartySocket } from "partysocket";

const HOST = process.env.PARTY_HOST ?? "127.0.0.1:8787";
const PARTY = "room";
const ROOM = "TESTROOM";

function connect(id) {
  const ws = new PartySocket({ host: HOST, party: PARTY, room: ROOM, id });
  ws.rosters = [];
  ws.addEventListener("message", (e) => {
    const msg = JSON.parse(e.data);
    if (msg.type === "roster") ws.rosters.push(msg.players);
  });
  return ws;
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const alice = connect("alice");
const bob = connect("bob");

await wait(1200);
alice.send(JSON.stringify({ type: "join", name: "Alice" }));
bob.send(JSON.stringify({ type: "join", name: "Bob" }));
await wait(800);
alice.send(JSON.stringify({ type: "progress", roundIndex: 2, totalScore: 1500, status: "guessing" }));
bob.send(JSON.stringify({ type: "progress", roundIndex: 4, totalScore: 4200, status: "finished" }));
await wait(1000);

const last = bob.rosters.at(-1) ?? [];
const byId = Object.fromEntries(last.map((p) => [p.id, p]));

let ok = true;
const check = (cond, label) => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}`);
  if (!cond) ok = false;
};

check(last.length === 2, "roster has 2 players");
check(byId.alice?.name === "Alice" && byId.alice?.totalScore === 1500 && byId.alice?.roundIndex === 2, "Alice progress relayed");
check(byId.bob?.name === "Bob" && byId.bob?.totalScore === 4200 && byId.bob?.status === "finished", "Bob finished status relayed");

// Disconnect removes from roster
alice.close();
await wait(1000);
const afterLeave = bob.rosters.at(-1) ?? [];
check(afterLeave.length === 1 && afterLeave[0].id === "bob", "leaving removes player from roster");

bob.close();
console.log(ok ? "\nALL PASSED" : "\nSOME FAILED");
process.exit(ok ? 0 : 1);
