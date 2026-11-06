import { mergeRuns, sliceRuns, textRuns } from "./rich-text.mjs";

// List markers stay readable in the plain-text field, backups and every export.
// Only prefixes change; formatting in the actual item text remains untouched.
const marker = /^(• |\d{1,6}\. )/;
export function listLines(text, {start, end}) {
  const first = start === 0 ? 0 : text.lastIndexOf("\n", start - 1) + 1;
  const last = end > start && text[end - 1] === "\n" ? end - 1 : end;
  const lines = [];
  let offset = first;
  do {
    const until = text.indexOf("\n", offset);
    const value = text.slice(offset, until < 0 ? text.length : until);
    const prefix = value.match(marker)?.[0] || "";
    lines.push({start: offset, value, prefix, kind: prefix.startsWith("•") ? "bullet" : prefix ? "number" : ""});
    if (until < 0 || until >= last) break;
    offset = until + 1;
  } while (offset <= last);
  return lines;
}

function edit(text, formatting, edits, selection) {
  const source = textRuns(text, formatting), result = [];
  let cursor = 0;
  for (const change of edits) {
    result.push(...sliceRuns(source, cursor, change.start));
    if (change.value) result.push({text: change.value});
    cursor = change.end;
  }
  result.push(...sliceRuns(source, cursor, text.length));
  function map(offset) {
    let delta = 0;
    for (const change of edits) {
      if (offset < change.start) break;
      if (offset <= change.end) return change.start + delta + change.value.length;
      delta += change.value.length - (change.end - change.start);
    }
    return offset + delta;
  }
  return {runs: mergeRuns(result), selection: {...selection, start: map(selection.start), end: map(selection.end)}};
}

export function toggleList(text, formatting, selection, kind) {
  if (!["bullet", "number"].includes(kind)) throw Error("Unbekannte Listenart.");
  const lines = listLines(text, selection);
  const remove = lines.every(line => line.kind === kind);
  const edits = lines.map((line, index) => ({
    start: line.start, end: line.start + line.prefix.length,
    value: remove ? "" : kind === "bullet" ? "• " : `${index + 1}. `
  }));
  return edit(text, formatting, edits, selection);
}

export function continueList(text, formatting, selection) {
  if (selection.start !== selection.end) return null;
  const [line] = listLines(text, selection);
  if (!line.prefix || selection.start < line.start + line.prefix.length) return null;
  if (!line.value.slice(line.prefix.length).trim()) {
    return edit(text, formatting, [{start: line.start, end: line.start + line.value.length, value: ""}], selection);
  }
  const number = Number.parseInt(line.prefix, 10);
  if (line.kind === "number" && number >= 999999) throw Error("Maximale Listennummer erreicht.");
  const prefix = line.kind === "bullet" ? "• " : `${number + 1}. `;
  const edits = [{start: selection.start, end: selection.end, value: `\n${prefix}`}];
  // Keep following numbered items sequential when inserting inside a list.
  if (line.kind === "number") {
    let offset = line.start + line.value.length + 1, next = number + 2;
    while (offset <= text.length) {
      const following = listLines(text, {start: offset, end: offset})[0];
      if (following.kind !== "number") break;
      if (next > 999999) throw Error("Maximale Listennummer erreicht.");
      edits.push({start: offset, end: offset + following.prefix.length, value: `${next++}. `});
      offset += following.value.length + 1;
    }
  }
  return edit(text, formatting, edits, selection);
}
