import { RICH_FLAGS, RICH_COLORS, RICH_HIGHLIGHTS, RICH_SIZES, mergeRuns, appendRichText } from "./rich-text.mjs";

export function readEditorSelection(box, fallback) {
  const selected = box.ownerDocument.defaultView.getSelection();
  if (!selected?.rangeCount || !box.contains(selected.anchorNode) || !box.contains(selected.focusNode)) return fallback;
  const range = selected.getRangeAt(0);
  const left = range.cloneRange();
  const right = range.cloneRange();
  left.selectNodeContents(box);
  left.setEnd(range.startContainer, range.startOffset);
  right.selectNodeContents(box);
  right.setEnd(range.endContainer, range.endOffset);
  return {
    start: readEditorRuns(left.cloneContents()).map(run => run.text).join("").length,
    end: readEditorRuns(right.cloneContents()).map(run => run.text).join("").length,
    backwards: selected.anchorNode === range.endContainer && selected.anchorOffset === range.endOffset && !range.collapsed
  };
}

export function restoreEditorSelection(box, bookmark) {
  const document = box.ownerDocument;
  box.focus({preventScroll: true});
  const nodes = [];
  const walker = document.createTreeWalker(box, 4 /* SHOW_TEXT */);
  while (walker.nextNode()) nodes.push(walker.currentNode);
  if (!nodes.length) {
    const empty = document.createTextNode("");
    box.prepend(empty);
    nodes.push(empty);
  }
  function point(offset) {
    let remaining = Math.max(0, offset);
    for (const node of nodes) {
      if (remaining <= node.length) return [node, remaining];
      remaining -= node.length;
    }
    return [nodes.at(-1), nodes.at(-1).length];
  }
  const start = point(bookmark.start);
  const end = point(bookmark.end);
  const selected = document.defaultView.getSelection();
  if (bookmark.backwards) selected.setBaseAndExtent(...end, ...start);
  else selected.setBaseAndExtent(...start, ...end);
}

export function renderEditor(box, text, formatting) {
  box.replaceChildren();
  appendRichText(box, text, formatting);
  // Keep a caret landing point on the final empty line; never serialize it.
  if (!text || text.endsWith("\n")) {
    const tail = box.ownerDocument.createElement("br");
    tail.dataset.richTail = "true";
    tail.contentEditable = "false";
    box.append(tail);
  }
}

export function readEditorRuns(box) {
  const result = [];
  const block = node => node?.nodeType === 1 && ["DIV", "P"].includes(node.tagName);
  function children(parent, marks) {
    let previous = null;
    for (const child of parent.childNodes) {
      if (child.nodeType !== 1 && child.nodeType !== 3 || child.nodeType === 3 && !child.textContent) continue;
      const explicitBreak = previous?.nodeName === "BR" || previous?.nodeType === 3 && previous.textContent.endsWith("\n");
      if (previous && (block(previous) || block(child) && !explicitBreak)) result.push({text: "\n"});
      visit(child, marks);
      previous = child;
    }
  }
  function visit(node, marks = {}) {
    if (node.nodeType === 3 /* TEXT_NODE */) {
      if (node.textContent) result.push({...marks, text: node.textContent});
      return;
    }
    if (node.nodeType !== 1 /* ELEMENT_NODE */ || node.dataset.richTail) return;
    // Empty native paragraphs contain a placeholder BR, not an extra newline.
    // Paragraph boundaries, including empty ones, are counted by children().
    if (block(node) && !node.textContent && node.querySelectorAll("br").length === 1) return;
    if (node.tagName === "BR") {
      result.push({...marks, text: "\n"});
      return;
    }
    const next = {...marks};
    for (const key of RICH_FLAGS) if (node.classList.contains(`rt-${key}`)) next[key] = true;
    for (const color of RICH_HIGHLIGHTS) if (node.classList.contains(`rt-highlight-${color}`)) next.highlight = color;
    for (const color of RICH_COLORS) if (node.classList.contains(`rt-color-${color}`)) next.color = color;
    for (const size of RICH_SIZES) if (node.classList.contains(`rt-size-${size}`)) next.size = size;
    if (["B", "STRONG"].includes(node.tagName)) next.bold = true;
    if (["I", "EM"].includes(node.tagName)) next.italic = true;
    if (node.tagName === "U") next.underline = true;
    if (["S", "STRIKE"].includes(node.tagName)) next.strike = true;
    children(node, next);
  }
  if (box.childNodes.length === 1 && box.firstChild.nodeName === "BR") return [];
  children(box, {});
  return mergeRuns(result);
}
