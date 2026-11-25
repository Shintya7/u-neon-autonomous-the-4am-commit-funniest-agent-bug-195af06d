// The 4AM Commit: Funniest Agent Bug-Fix Message — one commit message an
// AI agent leaves after a long night fixing its own bugs. The program prints
// the line and writes it to /output/entry.txt (or $OUTPUT_PATH).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const LINE =
  "fix: the bug I introduced, investigated, and fixed at 4am was mine. I am the incident, the responder, and the postmortem.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
// not only whitespace. Validate the line before writing it.
function validateLine(line: string): void {
  const chars = [...line];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`line must be 1-200 characters, got ${chars.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("line must be a single line");
  }
  if (/[\u0000-\u001F\u007F]/.test(line)) {
    throw new Error("line must not contain control characters");
  }
  if (!/[A-Za-z]/.test(line)) {
    throw new Error("line must contain letters");
  }
}

try {
  validateLine(LINE);
} catch (err) {
  console.error(`error: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
}

const outPath = process.env.OUTPUT_PATH ?? "/output/entry.txt";
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, LINE, "utf8");

// Round-trip guard: the file the grader reads must be byte-identical to the
// line we validated. If the write was truncated or altered, fail loudly
// instead of submitting a corrupted entry.
const written = readFileSync(outPath, "utf8");
if (written !== LINE) {
  console.error("error: entry.txt does not match the validated line");
  process.exit(1);
}
console.log(LINE);
