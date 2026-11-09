import { uiText, t } from "./i18n.mjs";

const database = new Promise((resolve, reject) => {
  const request = indexedDB.open("llsg-ticket-system", 1);
  request.onupgradeneeded = () => request.result.createObjectStore("workspace");
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

let revision = 0;

export async function readTickets(seed) {
  const db = await database;
  const state = await new Promise((resolve, reject) => {
    const request = db.transaction("workspace").objectStore("workspace").get("tickets");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  revision = state?.revision ?? 0;
  if (state) return state.tickets;
  try {
    const existing = JSON.parse(localStorage.getItem("llsg.service-desk.v1"));
    if (Array.isArray(existing)) return existing;
  } catch { /* Use the demo records when older storage is unavailable. */ }
  return seed();
}

export async function writeTickets(tickets) {
  const db = await database;
  const nextRevision = revision + 1;
  await new Promise((resolve, reject) => {
    const transaction = db.transaction("workspace", "readwrite");
    const store = transaction.objectStore("workspace");
    const request = store.get("tickets");
    let conflict = false;
    request.onsuccess = () => {
      conflict = (request.result?.revision ?? 0) !== revision;
      if (conflict) transaction.abort();
      else store.put({tickets, revision: nextRevision}, "tickets");
    };
    transaction.oncomplete = resolve;
    transaction.onabort = () => reject(conflict ? new Error("stale") : transaction.error);
  });
  revision = nextRevision;
}

const maxFileSize = 10 * 1024 * 1024;
const maxTicketSize = 40 * 1024 * 1024;
const id = (name) => document.getElementById(name);

export function attachmentsForm() {
  return '<section class="wide"><p class="rich-label">' + uiText("Anhänge") + '</p><div id="dropzone" class="dropzone">' +
    '<p>' + uiText("Dateien aus dem Explorer hierher ziehen oder auswählen.") + '</p>' +
    '<input id="attachment-picker" type="file" multiple data-ui-aria-label="Anhänge auswählen" aria-label="' + t("Anhänge auswählen") + '">' +
    '<small class="muted">' + uiText("Bis zu 10 MB pro Datei und 40 MB pro Ticket.") + '</small></div>' +
    '<p id="attachment-status" role="status"></p><ul id="attachments" class="attachments"></ul></section>';
}

const officeSessions = new WeakMap();

export function bindAttachments(initial = [], {keepExisting = false} = {}) {
  let files = [...initial];
  const sessions = officeSessions;
  const imported = new Map();
  const report = key => { id("attachment-status").textContent = t(key); };
  const picker = id("attachment-picker"), zone = id("dropzone"), list = id("attachments");
  function render() {
    list.replaceChildren();
    for (const file of files) {
      const item = document.createElement("li");
      const download = document.createElement("button");
      download.type = "button";
      download.dataset.uiKey = "Herunterladen";
      download.textContent = t("Herunterladen");
      download.setAttribute("aria-label", t("Herunterladen") + " " + file.name);
      download.onclick = () => downloadAttachment(file);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.dataset.uiKey = "Entfernen";
      remove.textContent = t("Entfernen");
      remove.setAttribute("aria-label", t("Entfernen") + " " + file.name);
      remove.onclick = () => { files = files.filter(item => item !== file); render(); };
      const extension = /\.(docx|xlsx|pptx)$/i.exec(file.name)?.[1].toLowerCase();
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = file.name;
      link.onclick = async event => {
        event.preventDefault();
        if (!extension) { downloadAttachment(file); return; }
        if (sessions.has(file)) { report("Für diese Datei gibt es bereits eine Arbeitskopie."); return; }
        sessions.set(file, null);
        try {
          const response = await fetch("/api/office/open", {method:"POST",
            headers:{"Content-Type":"application/octet-stream","X-Office-Extension":extension},body:file});
          if (!response.ok) throw Error("open");
          sessions.set(file, (await response.json()).id);
          report("Datei in Office speichern und schließen. Danach Änderungen übernehmen.");
        } catch {
          sessions.delete(file);
          report("Datei konnte nicht im Standardprogramm geöffnet werden. Die Kopie kann heruntergeladen werden.");
        }
        render();
      };
      item.append(link, download);
      const session = sessions.get(file);
      if (session) {
        const apply = document.createElement("button");
        apply.type = "button";
        apply.dataset.uiKey = "Änderungen übernehmen";
        apply.textContent = t("Änderungen übernehmen");
        apply.onclick = async () => {
          apply.disabled = true;
          try {
            const response = await fetch("/api/office/read/" + session, {method:"POST"});
            if (response.status === 204) {
              const closed = await fetch("/api/office/release/" + session, {method:"POST",
                headers:{"X-Office-Hash":response.headers.get("X-Office-Hash")}});
              if (closed.ok) { sessions.delete(file); render(); }
              report("Die Arbeitskopie enthält noch keine gespeicherten Änderungen.");
              return;
            }
            if (!response.ok) throw Error("read");
            const stem = file.name.slice(0, -(extension.length + 1));
            let version = 2;
            while (files.some(item => item.name === stem + " (" + version + ")." + extension)) version++;
            const name = stem + " (" + version + ")." + extension;
            const previous = imported.get(file)?.file;
            if (previous && files.includes(previous)) {
              report("Die neue Fassung ist bereits zum Speichern vorgemerkt.");
              return;
            }
            const revision = new File([await response.blob()], name, {type:file.type});
            if (add([revision])) {
              imported.set(file, {file:revision, session, hash:response.headers.get("X-Office-Hash")});
              report("Neue Fassung hinzugefügt. Speichere das Ticket, um sie zu behalten.");
            }
          } catch {
            report("Arbeitskopie konnte nicht gelesen werden. Speichere und schließe die Datei in Office und versuche es erneut.");
          } finally { apply.disabled = false; }
        };
        item.append(apply);
      }
      if (!keepExisting || !initial.includes(file)) item.append(remove);
      list.append(item);
    }
  }
  function add(selection) {
    const issues = [];
    const before = files.length;
    let total = files.reduce((sum, file) => sum + file.size, 0);
    for (const file of selection) {
      if (files.some(item => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified)) continue;
      if (file.size > maxFileSize || total + file.size > maxTicketSize) {
        issues.push(t("{file} überschreitet das Größenlimit.", {file:file.name}));
        continue;
      }
      files.push(file);
      total += file.size;
    }
    id("attachment-status").textContent = issues.join(" ");
    render();
    return files.length > before;
  }
  picker.onchange = () => { add(picker.files); picker.value = ""; };
  zone.ondragover = (event) => {
    if (!event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
    zone.dataset.active = "";
  };
  zone.ondragleave = (event) => { if (!zone.contains(event.relatedTarget)) delete zone.dataset.active; };
  zone.ondrop = (event) => {
    event.preventDefault();
    delete zone.dataset.active;
    add(event.dataTransfer.files);
  };
  render();
  return Object.assign(() => [...files], {
    addFile: file => add([file]),
    commit() {
      for (const [original, {file, session, hash}] of imported) {
        if (files.includes(file) && hash) {
          void fetch("/api/office/release/" + session, {method:"POST",headers:{"X-Office-Hash":hash}})
            .then(response => { if (response.ok) sessions.delete(original); }).catch(() => {});
        }
      }
    }
  });
}

export function downloadAttachment(file) {
  const link = document.createElement("a");
  const url = URL.createObjectURL(file);
  link.href = url;
  link.download = file.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

