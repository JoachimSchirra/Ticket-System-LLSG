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
  return '<section class="wide"><p class="rich-label">Anhänge</p><div id="dropzone" class="dropzone">' +
    '<p>Dateien aus dem Explorer hierher ziehen oder auswählen.</p>' +
    '<input id="attachment-picker" type="file" multiple aria-label="Anhänge auswählen">' +
    '<small class="muted"> Bis zu 10 MB pro Datei und 40 MB pro Ticket.</small></div>' +
    '<p id="attachment-status" role="status"></p><ul id="attachments" class="attachments"></ul></section>';
}

export function bindAttachments(initial = []) {
  let files = [...initial];
  const picker = id("attachment-picker"), zone = id("dropzone"), list = id("attachments");
  function render() {
    list.replaceChildren();
    for (const file of files) {
      const item = document.createElement("li");
      const download = document.createElement("button");
      download.type = "button";
      download.textContent = "Herunterladen";
      download.setAttribute("aria-label", file.name + " herunterladen");
      download.onclick = () => {
        const link = document.createElement("a");
        const url = URL.createObjectURL(file);
        link.href = url;
        link.download = file.name;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      };
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Entfernen";
      remove.setAttribute("aria-label", file.name + " entfernen");
      remove.onclick = () => { files = files.filter(item => item !== file); render(); };
      item.append(file.name, download, remove);
      list.append(item);
    }
  }
  function add(selection) {
    const issues = [];
    let total = files.reduce((sum, file) => sum + file.size, 0);
    for (const file of selection) {
      if (files.some(item => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified)) continue;
      if (file.size > maxFileSize || total + file.size > maxTicketSize) {
        issues.push(file.name + " überschreitet das Größenlimit.");
        continue;
      }
      files.push(file);
      total += file.size;
    }
    id("attachment-status").textContent = issues.join(" ");
    render();
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
  return () => [...files];
}
