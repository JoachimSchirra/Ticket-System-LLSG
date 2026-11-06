import { createRichEditor } from "./rich-editor.mjs";
import { appendRichText } from "./rich-text.mjs";
import { attachmentsForm, bindAttachments, readTickets, writeTickets } from "./storage.mjs";

"use strict";

const types = ["Noch nicht eingeordnet", "Störung", "Serviceanfrage", "Änderungsantrag", "Neues Vorhaben"];
const statuses = ["Neu", "In Bearbeitung", "Wartet auf Rückmeldung", "Abgeschlossen"];
const priorities = ["Niedrig", "Normal", "Hoch", "Kritisch"];
const decisions = ["Nicht beantragt", "In Prüfung", "Abgelehnt", "Als Projekt übernommen"];
const services = ["ERP", "Arbeitsplatz & Hardware", "Zugänge & Berechtigungen", "E-Mail & Zusammenarbeit", "Netzwerk & VPN", "Sonstiger IT-Service"];
const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
const options = (values, current) => values.map((value) =>
  '<option' + (value === current ? ' selected' : '') + '>' + esc(value) + '</option>'
).join("");

const examples = [
  ["Rechnungsbuchung im ERP schlägt fehl", "Beim Buchen einer Eingangsrechnung erscheint ein Fehler. Mehrere Personen sind betroffen.", types[1], statuses[1], priorities[2], decisions[0]],
  ["ERP-Buchhaltungsrolle beantragen", "Eine neue Kollegin benötigt die bestehende Rolle für die Kreditorenbuchhaltung.", types[2], statuses[0], priorities[1], decisions[0]],
  ["Zweite ERP-Freigabestufe ergänzen", "Rechnungen ab 10.000 Euro sollen eine zusätzliche Freigabe erhalten.", types[3], statuses[1], priorities[1], decisions[1]],
  ["Lieferantenportal einführen", "Lieferanten sollen ihre Stammdaten prüfen und Nachweise bereitstellen können.", types[4], statuses[0], priorities[1], decisions[0]]
];

function seed() {
  return examples.map(([title, description, type, status, priority, decision], index) => ({
    number: index + 1, title, description, type, status, priority, decision,
    reference: "", rationale: decision === decisions[1] ? "Abstimmung mit Einkauf und Finanzbuchhaltung erforderlich." : "",
    owner: "", requester: "LLSG-Demobenutzer", service: "ERP",
    history: [{text: "Fiktiver Pilotfall angelegt", at: new Date().toISOString()}]
  }));
}

let tickets = [];

async function save(next) {
  try {
    await writeTickets(next);
    tickets = next;
    return true;
  } catch {
    $("error").textContent = "Die Änderung konnte nicht gespeichert werden. Bitte prüfe den verfügbaren Browserspeicher.";
    return false;
  }
}
const number = (ticket) => "IT-" + String(ticket.number).padStart(4, "0");
const date = (value) => new Intl.DateTimeFormat("de-DE", {dateStyle:"short", timeStyle:"short"}).format(new Date(value));
const event = (text) => ({text, at: new Date().toISOString()});
$("type").innerHTML = options(["Alle Typen", ...types]);
$("status").innerHTML = options(["Alle Status", ...statuses]);

function render() {
  const totals = [
    ["Offene Tickets", tickets.filter(t => t.status !== statuses[3]).length],
    ["Neue Tickets", tickets.filter(t => t.status === statuses[0]).length],
    ["Hohe Priorität", tickets.filter(t => t.status !== statuses[3] && priorities.indexOf(t.priority) >= 2).length],
    ["In Projektprüfung", tickets.filter(t => t.decision === decisions[1]).length]
  ];
  $("metrics").innerHTML = totals.map(([label, count]) => '<div class="metric"><strong>' + count + '</strong>' + label + '</div>').join("");
  const query = $("search").value.trim().toLocaleLowerCase("de");
  const filtered = tickets.filter(t =>
    (!$("type").selectedIndex || t.type === $("type").value) &&
    (!$("status").selectedIndex || t.status === $("status").value) &&
    [number(t), t.title, t.description, t.owner, t.service].join(" ").toLocaleLowerCase("de").includes(query)
  );
  $("rows").innerHTML = filtered.slice().reverse().map(t =>
    '<button class="row" data-number="' + t.number + '"><span><small>' + number(t) + ' · ' + esc(t.service || "IT") + '</small>' + esc(t.title) +
    '</span><span>' + esc(t.type) + '</span><span class="pill">' + esc(t.status) +
    '</span><span class="pill ' + (priorities.indexOf(t.priority) >= 2 ? "urgent" : "") + '">' + esc(t.priority) + '</span></button>'
  ).join("") || '<p class="muted empty">Keine Tickets für diese Auswahl.</p>';
}

function show(kicker, title, body) {
  $("dialog-kicker").textContent = kicker;
  $("dialog-title").textContent = title;
  $("content").innerHTML = body;
  $("dialog").showModal();
}

const formEnd = '<div id="error" class="error" role="alert"></div><footer><button type="button" data-close>Abbrechen</button><button class="primary">Speichern</button></footer></form>';
const select = (label, name, values, current) => '<label>' + label + '<select name="' + name + '">' + options(values, current) + '</select></label>';
const field = (label, name, value, extra = "") => '<label>' + label + '<input name="' + name + '" value="' + esc(value) + '" ' + extra + '></label>';

function openNew() {
  show("TICKETANLAGE · IT", "Neues Anliegen", '<form id="edit"><div class="grid">' +
    field("Betreff", "title", "", "required maxlength=120") +
    field("Anfragende Person", "requester", "", "required maxlength=100") +
    select("Anliegenstyp", "type", types, types[0]) +
    select("Betroffener Service", "service", ["Noch nicht bekannt", ...services], "Noch nicht bekannt") +
    select("Dringlichkeit (Einschätzung)", "urgency", ["Niedrig", "Normal", "Hoch", "Sofort"], "Normal") +
    '<section class="wide"><p id="description-label" class="rich-label">Beschreibung</p>' +
    '<div class="rich-editor-group"><div id="description-toolbar" class="rich-toolbar" role="group" aria-label="Beschreibung formatieren"></div>' +
    '<div id="description-editor" class="rich-editor rich-text" contenteditable="true" role="textbox" aria-multiline="true" aria-required="true" aria-labelledby="description-label"></div></div>' +
    '<textarea hidden id="description-input" name="description"></textarea><p id="description-status" class="rich-editor-status" role="status"></p></section>' +
    attachmentsForm() + '</div>' + formEnd);
  const editor = createRichEditor({
    box: $("description-editor"), toolbar: $("description-toolbar"),
    field: $("description-input"), status: $("description-status")
  });
  editor.setValue("");
  $("dialog").addEventListener("close", () => editor.dispose(), {once:true});
  const attachments = bindAttachments();
  $("edit").onsubmit = async (e) => {
    e.preventDefault();
    const fields = Object.fromEntries([...new FormData(e.target)].map(([name, value]) => [name, name === "description" ? value : value.trim()]));
    if (!fields.title || !fields.requester || !fields.description.trim() || fields.description.length > 3000) {
      $("error").textContent = "Bitte Betreff, anfragende Person und eine Beschreibung mit bis zu 3.000 Zeichen eingeben.";
      return;
    }
    const ticket = {...fields, number: Math.max(0, ...tickets.map(t => t.number)) + 1,
      descriptionFormat: editor.getFormat(), attachments: attachments(),
      status: statuses[0], priority: priorities[1], decision: decisions[0],
      reference: "", rationale: "", owner: "", history: [event("Ticket angelegt")]};
    await submit(e.target, [...tickets, ticket], number(ticket) + " wurde angelegt.");
  };
}

async function submit(form, next, message) {
  const button = form.querySelector("button.primary");
  if (button.disabled) return;
  button.disabled = true;
  try {
    if (await save(next)) complete(message);
  } finally {
    button.disabled = false;
  }
}
function openTicket(ticket) {
  show(number(ticket) + " · IT", ticket.title,
    '<p class="muted">' + esc(ticket.requester) + ' · ' + esc(ticket.service || "IT") + (ticket.urgency ? " · Gemeldete Dringlichkeit: " + esc(ticket.urgency) : "") + '</p><p id="ticket-description" class="rich-text">' +
    '</p><form id="edit"><div class="grid">' +
    select("Anliegenstyp", "type", types, ticket.type) + select("Bearbeitungsstatus", "status", statuses, ticket.status) +
    select("Priorität", "priority", priorities, ticket.priority) + field("Zuständige Person", "owner", ticket.owner, "maxlength=100") +
    select("Projektentscheidung", "decision", decisions, ticket.decision) + field("Projektreferenz", "reference", ticket.reference, "maxlength=100") +
    '<label class="wide">Begründung der Projektentscheidung<textarea name="rationale" rows="2" maxlength="1200">' +
    esc(ticket.rationale) + '</textarea></label><label class="wide">Verlaufsnotiz<textarea name="note" rows="2" maxlength="1200"></textarea></label>' + attachmentsForm() + '</div>' +
    formEnd + '<section class="history"><h3>Verlauf</h3><ul>' + ticket.history.slice().reverse().map(entry =>
      '<li><small class="muted">' + date(entry.at) + '</small> · ' + esc(entry.text) + '</li>').join("") + '</ul></section>');
  appendRichText($("ticket-description"), ticket.description, ticket.descriptionFormat);
  const attachments = bindAttachments(ticket.attachments);
  $("edit").onsubmit = async (e) => {
    e.preventDefault();
    const {note, ...fields} = Object.fromEntries([...new FormData(e.target)].map(([name, value]) => [name, value.trim()]));
    if (fields.decision === decisions[3] && !fields.reference) {
      $("error").textContent = "Für die Projektübernahme ist eine Projektreferenz erforderlich.";
      return;
    }
    if (fields.decision !== ticket.decision && fields.decision !== decisions[0] && !fields.rationale) {
      $("error").textContent = "Bitte die Projektentscheidung begründen.";
      return;
    }
    const labels = {type:"Anliegenstyp", status:"Status", priority:"Priorität", owner:"Zuständigkeit", decision:"Projektentscheidung", reference:"Projektreferenz", rationale:"Projektbegründung"};
    const history = Object.keys(fields).filter(name => fields[name] !== ticket[name]).map(name =>
      event(labels[name] + " geändert: " + (ticket[name] || "–") + " → " + (fields[name] || "–")));
    if (note) history.push(event(note));
    const files = attachments();
    const previousFiles = ticket.attachments ?? [];
    for (const file of files.filter(file => !previousFiles.includes(file))) history.push(event("Anhang hinzugefügt: " + file.name));
    for (const file of previousFiles.filter(file => !files.includes(file))) history.push(event("Anhang entfernt: " + file.name));
    if (!history.length) {
      $("dialog").close();
      return;
    }
    const updated = {...ticket, ...fields, attachments: files, history: [...ticket.history, ...history]};
    await submit(e.target, tickets.map(t => t.number === ticket.number ? updated : t), number(ticket) + " wurde aktualisiert.");
  };
}

function complete(message) {
  $("dialog").close();
  render();
  $("notice").textContent = message;
}

$("new").onclick = openNew;
$("close").onclick = () => $("dialog").close();
$("content").onclick = (e) => { if (e.target.closest("[data-close]")) $("dialog").close(); };
$("rows").onclick = (e) => {
  const row = e.target.closest("[data-number]");
  if (row) openTicket(tickets.find(t => t.number === Number(row.dataset.number)));
};
$("search").oninput = render;
$("type").onchange = render;
$("status").onchange = render;
try {
  tickets = await readTickets(seed);
  render();
} catch {
  $("new").disabled = true;
  $("notice").textContent = "Der Browserspeicher ist nicht verfügbar. Bitte öffne den Prototyp in einem normalen Browserfenster.";
}

