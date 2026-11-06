// A closed data format: no HTML, CSS, links or event attributes are stored.
export const RICH_FLAGS = Object.freeze(["bold", "italic", "underline", "strike"]);
export const RICH_HIGHLIGHTS = Object.freeze(["yellow", "green", "blue", "pink"]);
export const RICH_COLORS = Object.freeze(["red", "green", "blue", "purple", "orange"]);
export const RICH_SIZES = Object.freeze(["small", "large", "xlarge"]);
const formatKeys = [...RICH_FLAGS, "highlight", "size", "color"];
const keys = ["text", ...formatKeys];
const same = (a, b) => formatKeys.every(key => a[key] === b[key]);
export function mergeRuns(runs) {
  const result = [];
  for (const run of runs) {
    if (!run.text) continue;
    const normalized = {text: run.text};
    for (const flag of RICH_FLAGS) if (run[flag]) normalized[flag] = true;
    if (run.highlight) normalized.highlight = run.highlight;
    if (run.size) normalized.size = run.size;
    if (run.color) normalized.color = run.color;
    if (result.length && same(result.at(-1), normalized)) result.at(-1).text += normalized.text;
    else result.push(normalized);
  }
  return result;
}
export function validateRichText(raw, text) {
  if (!Array.isArray(raw) || raw.length > 1000) throw Error("Maximal 1.000 Textabschnitte pro Textfeld.");
  if (!raw.length) return [];
  for (const run of raw) {
    if (!run || typeof run !== "object" || Array.isArray(run) || Object.keys(run).some(key => !keys.includes(key)) || typeof run.text !== "string" || !run.text || run.text.length > 10000 || !run.text.isWellFormed()) throw Error("Ungültiger formatierter Textabschnitt.");
    for (const flag of RICH_FLAGS) if (run[flag] !== undefined && typeof run[flag] !== "boolean") throw Error("Ungültige Textformatierung.");
    if (run.highlight !== undefined && !RICH_HIGHLIGHTS.includes(run.highlight)) throw Error("Ungültige Hervorhebungsfarbe.");
    if (run.color !== undefined && !RICH_COLORS.includes(run.color)) throw Error("Ungültige Schriftfarbe.");
    if (run.size !== undefined && !RICH_SIZES.includes(run.size)) throw Error("Ungültige Schriftgröße.");
  }
  if (raw.map(run => run.text).join("") !== text) throw Error("Formatierung und Text passen nicht zusammen.");
  const normalized = mergeRuns(raw);
  if (JSON.stringify(normalized).length > 48000) throw Error("Zu viele einzelne Formatierungen. Bitte Abschnitte vereinheitlichen.");
  return normalized.some(run => Object.keys(run).length > 1) ? normalized : [];
}
export const textRuns = (text, runs = []) => runs.length ? runs : text ? [{text}] : [];
export function sliceRuns(runs, from, until) {
  const result = []; let cursor = 0;
  for (const run of runs) {
    const left = Math.max(0, from - cursor), right = Math.min(run.text.length, until - cursor);
    if (right > left) result.push({...run, text: run.text.slice(left, right)});
    cursor += run.text.length;
  }
  return result;
}
export function formatRange(text, runs, start, end, patch = {}) {
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end > text.length || start >= end) throw Error("Bitte zuerst Text zum Formatieren markieren.");
  const splitsPair = index => index > 0 && index < text.length && /[\uD800-\uDBFF]/.test(text[index - 1]) && /[\uDC00-\uDFFF]/.test(text[index]);
  if (splitsPair(start) || splitsPair(end)) throw Error("Die Markierung darf kein Unicode-Zeichen teilen.");
  const source = textRuns(text, runs), selected = sliceRuns(source, start, end).map(run => {
    if (patch.clear) return {text: run.text};
    const value = {...run};
    for (const [key, entry] of Object.entries(patch)) { if (entry) value[key] = entry; else delete value[key]; }
    return value;
  });
  return validateRichText(mergeRuns([...sliceRuns(source, 0, start), ...selected, ...sliceRuns(source, end, text.length)]), text);
}
export function runClasses(run) {
  return [...RICH_FLAGS.filter(key => run[key]).map(key => `rt-${key}`), ...(run.highlight ? [`rt-highlight-${run.highlight}`] : []), ...(run.size ? [`rt-size-${run.size}`] : []), ...(run.color ? [`rt-color-${run.color}`] : [])].join(" ");
}
const escape = value => value.replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
export function richTextHtml(text, raw = []) {
  const runs = validateRichText(raw, text);
  return textRuns(text, runs).map(run => {
    const classes = runClasses(run), content = escape(run.text);
    return classes ? `<span class="${classes}">${content}</span>` : content;
  }).join("");
}
export function appendRichText(container, text, raw = []) {
  const runs = validateRichText(raw, text), document = container.ownerDocument;
  for (const run of textRuns(text, runs)) {
    const classes = runClasses(run);
    if (!classes) container.append(document.createTextNode(run.text));
    else { const span = document.createElement("span"); span.className = classes; span.textContent = run.text; container.append(span); }
  }
}

export function normalizeRichNewlines(text, formatting = []) {
  const valid = validateRichText(formatting, text);
  let previousCR = false;
  return mergeRuns(textRuns(text, valid).map(run => {
    let normalized = "";
    for (const character of run.text) {
      if (!(character === "\n" && previousCR)) normalized += character === "\r" ? "\n" : character;
      previousCR = character === "\r";
    }
    return {...run, text: normalized};
  }));
}
