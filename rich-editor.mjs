import { listLines, toggleList, continueList } from "./rich-list.mjs";
import { readEditorSelection, restoreEditorSelection, renderEditor, readEditorRuns } from "./rich-editor-dom.mjs";
import { mergeRuns, validateRichText, textRuns, sliceRuns, formatRange, normalizeRichNewlines } from "./rich-text.mjs";
export function createRichEditor({box, toolbar, field, status, onChange}) {
  toolbar.append(box.ownerDocument.getElementById("rich-toolbar-template").content.cloneNode(true));
  let runs = [], bookmark = {start: 0, end: 0}, undo = [], redo = [], composing = false, readonly = false;
  const text = () => runs.map(run => run.text).join("");
  const format = () => validateRichText(runs, text());
  function selection() { bookmark = readEditorSelection(box, bookmark); return bookmark; }
  function restore() { restoreEditorSelection(box, bookmark); }
  function draw() { renderEditor(box, text(), format()); }
  function snapshot() { return {runs: structuredClone(runs), bookmark: {...bookmark}}; }
  function notify() { const before = field.value; field.value = text(); onChange?.({textChanged: before !== field.value}); updateToolbar(); }
  function updateToolbar() {
    const chosen = sliceRuns(runs, bookmark.start, bookmark.end);
    for (const button of toolbar.querySelectorAll("[data-rich-flag]")) button.setAttribute("aria-pressed", String(chosen.length > 0 && chosen.every(run => run[button.dataset.richFlag])));
    for (const key of ["highlight", "size", "color"]) {
      const control = toolbar.querySelector(`[data-rich-${key}]`), values = new Set(chosen.map(run => run[key] || ""));
      control.value = values.size > 1 ? "mixed" : values.values().next().value || "";
    }
    const lines = listLines(text(), bookmark);
    for (const button of toolbar.querySelectorAll("[data-rich-list]")) button.setAttribute("aria-pressed", String(lines.every(line => line.kind === button.dataset.richList)));
    toolbar.querySelector("[data-rich-undo]").disabled = readonly || !undo.length;
    toolbar.querySelector("[data-rich-redo]").disabled = readonly || !redo.length;
  }
  function adopt(next, nextBookmark = bookmark, redraw = true) {
    const content = next.map(run => run.text).join("");
    if (content.length > 10000) throw Error("Maximal 10.000 Zeichen pro Textfeld.");
    const checked = validateRichText(mergeRuns(next), content), canonical = textRuns(content, checked);
    if (JSON.stringify(canonical) === JSON.stringify(runs)) { bookmark = {...nextBookmark}; updateToolbar(); return; }
    undo.push(snapshot()); if (undo.length > 100) undo.shift(); redo = [];
    runs = canonical; bookmark = {...nextBookmark}; status.textContent = "";
    if (redraw) { draw(); restore(); }
    notify();
  }
  function fail(error) { status.textContent = error.message; }
  function apply(patch) {
    if (readonly) return;
    try { selection(); const result = formatRange(text(), format(), bookmark.start, bookmark.end, patch); adopt(textRuns(text(), result)); }
    catch (error) { fail(error); }
  }
  function replace(value) {
    if (readonly) return;
    selection(); const source = runs, content = text();
    const inherited = sliceRuns(source, bookmark.start, Math.min(content.length, bookmark.start + 1))[0] || sliceRuns(source, Math.max(0, bookmark.start - 1), bookmark.start)[0] || {};
    const next = mergeRuns([...sliceRuns(source, 0, bookmark.start), ...(value ? [{...inherited, text: value}] : []), ...sliceRuns(source, bookmark.end, content.length)]);
    const caret = bookmark.start + value.length;
    adopt(next, {start: caret, end: caret});
  }
  function history(backwards) {
    if (readonly) return;
    const from = backwards ? undo : redo, to = backwards ? redo : undo;
    if (!from.length) return;
    to.push(snapshot()); const next = from.pop(); runs = next.runs; bookmark = next.bookmark;
    draw(); restore(); notify(); status.textContent = backwards ? "Änderung im Text zurückgenommen." : "Änderung im Text wiederholt.";
  }
  box.addEventListener("beforeinput", event => {
    if (readonly) { event.preventDefault(); return; }
    selection();
    if (!composing && event.inputType === "insertText" && /[\r\n]/.test(event.data || "")) {
      event.preventDefault();
      try { replace(event.data.replace(/\r\n?/g, "\n")); } catch (error) { fail(error); }
      return;
    }
    if (["insertParagraph", "insertLineBreak"].includes(event.inputType)) {
      event.preventDefault();
      try {
        const next = event.inputType === "insertParagraph" ? continueList(text(), format(), bookmark) : null;
        if (next) adopt(next.runs, next.selection);
        else replace("\n");
      } catch (error) { fail(error); }
    }
    const flag = {formatBold: "bold", formatItalic: "italic", formatUnderline: "underline", formatStrikeThrough: "strike"}[event.inputType];
    if (flag) { event.preventDefault(); toggle(flag); }
    if (["historyUndo", "historyRedo"].includes(event.inputType)) { event.preventDefault(); history(event.inputType === "historyUndo"); }
  });
  function changed() {
    if (readonly || composing) return;
    try { const current = selection(); adopt(readEditorRuns(box), current, Boolean(box.querySelector("div,p"))); }
    catch (error) { draw(); restore(); fail(error); }
  }
  box.addEventListener("input", changed);
  box.addEventListener("compositionstart", () => { selection(); composing = true; });
  box.addEventListener("compositionend", () => { composing = false; changed(); });
  for (const type of ["paste", "drop"]) box.addEventListener(type, event => {
    event.preventDefault(); const value = (event.clipboardData || event.dataTransfer)?.getData("text/plain") || "";
    if (readonly || !value) return;
    try { replace(value.replace(/\r\n?/g, "\n")); } catch (error) { fail(error); }
  });
  function toggle(flag) { selection(); const chosen = sliceRuns(runs, bookmark.start, bookmark.end); apply({[flag]: !(chosen.length && chosen.every(run => run[flag]))}); }
  for (const button of toolbar.querySelectorAll("button")) button.addEventListener("mousedown", event => event.preventDefault());
  for (const button of toolbar.querySelectorAll("[data-rich-flag]")) button.addEventListener("click", () => toggle(button.dataset.richFlag));
  for (const button of toolbar.querySelectorAll("[data-rich-list]")) button.addEventListener("click", () => {
    if (readonly) return;
    try {
      selection();
      const next = toggleList(text(), format(), bookmark, button.dataset.richList);
      adopt(next.runs, next.selection);
    } catch (error) { fail(error); }
  });
  toolbar.querySelector("[data-rich-clear]").addEventListener("click", () => apply({clear: true}));
  for (const key of ["highlight", "size", "color"]) toolbar.querySelector(`[data-rich-${key}]`).addEventListener("change", event => apply({[key]: event.target.value}));
  toolbar.querySelector("[data-rich-undo]").addEventListener("click", () => history(true));
  toolbar.querySelector("[data-rich-redo]").addEventListener("click", () => history(false));
  function shortcuts(event) {
    if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
    const key = event.key.toLowerCase(), flag = {b: "bold", i: "italic", u: "underline"}[key];
    if (flag || key === "z" || key === "y") { event.preventDefault(); event.stopPropagation(); if (flag) toggle(flag); else history(key === "z" && !event.shiftKey); }
  }
  box.addEventListener("keydown", shortcuts); toolbar.addEventListener("keydown", shortcuts);
  const selectionController = new AbortController();
  box.ownerDocument.addEventListener("selectionchange", () => { if (box.contains(window.getSelection()?.anchorNode)) { selection(); updateToolbar(); } }, {signal: selectionController.signal});
  function setValue(value, formatting = []) {
    runs = normalizeRichNewlines(value, formatting); bookmark = {start: 0, end: 0}; undo = []; redo = []; status.textContent = ""; field.value = text(); draw(); updateToolbar();
  }
  function setReadOnly(value) {
    readonly = value; box.contentEditable = String(!value); box.setAttribute("aria-readonly", String(value));
    for (const control of toolbar.querySelectorAll("button,select")) control.disabled = value;
    updateToolbar();
  }
  return { setValue, setReadOnly, getFormat: format, dispose: () => selectionController.abort() };
}

