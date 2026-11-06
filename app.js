import { getLanguage, setLanguage, languages, localize, t, t as translate } from "./i18n.mjs";
import { translationPanel, bindTranslation } from "./translation.mjs";
import { createRichEditor } from "./rich-editor.mjs";
import { appendRichText } from "./rich-text.mjs";
import { attachmentsForm, bindAttachments, readTickets, writeTickets } from "./storage.mjs";

"use strict";

const types = ["Noch nicht eingeordnet", "Störung", "Serviceanfrage", "Änderungsantrag", "Neues Vorhaben"];
const statuses = ["Neu", "In Bearbeitung", "Wartet auf Rückmeldung", "Abgeschlossen"];
const priorities = ["Niedrig", "Normal", "Hoch", "Kritisch"];
const decisions = ["Nicht beantragt", "In Prüfung", "Abgelehnt", "Als Projekt übernommen"];
const services = ["ERP", "Arbeitsplatz & Hardware", "Zugänge & Berechtigungen", "E-Mail & Zusammenarbeit", "Netzwerk & VPN", "Sonstiger IT-Service"];
const people = [
  {name:"Big Joe", department:"IT / SAP"},
  {name:"Felix Klug", department:"IT / SAP"},
  {name:"Old Grumpy SAP Cat", department:"IT / SAP"},
  {name:"Max Krüger", department:"Vertrieb"},
  {name:"Dr. Maria Neumann", department:"Wissenschaft / Forschung"},
  {name:"Thomas Berger", department:"Geschäftsführung"},
  {name:"Matthias „Matze“ Reuter", department:"Bereichsübergreifend"},
  {name:"Elena Rossi", department:"Zuordnung offen"}
];
const departments = [...new Set(people.map(person => person.department))];
const otherRequester = "Andere Person";
const intake = {
  "Noch nicht eingeordnet": {hint:"Beschreibe dein Anliegen in eigenen Worten. Die IT übernimmt die Einordnung.", fields:[], next:"Anliegen sichten und einem Bearbeitungsweg zuordnen."},
  "Störung": {hint:"Beschreibe, was ausgefallen ist und wie stark die Arbeit betroffen ist.", fields:[["impact","Wer ist betroffen?",["Nur ich","Ein Team","Mehrere Teams","Ganze Organisation"]],["workaround","Gibt es einen Ausweichweg?",["Ja","Nein"]]], next:"Auswirkung und Dringlichkeit prüfen und den Betrieb wiederherstellen."},
  "Serviceanfrage": {hint:"Gib an, für wen und bis wann die Leistung gebraucht wird.", fields:[["beneficiary","Für wen ist die Anfrage?",["Für mich","Für eine andere Person","Für ein Team"]],["needed","Benötigt bis","date"]], next:"Standardleistung und erforderliche Freigabe prüfen."},
  "Änderungsantrag": {hint:"Beschreibe den heutigen Zustand und das gewünschte Ergebnis.", fields:[["changeScope","Welche Art von Änderung?",["Konfiguration","Funktionserweiterung","Schnittstelle","Sonstiges"]],["needed","Gewünschter Termin","date"]], next:"Auswirkungen und Risiken bewerten und über Freigabe oder Projektprüfung entscheiden."},
  "Neues Vorhaben": {hint:"Beschreibe das angestrebte Ergebnis und wer davon profitiert.", fields:[["coordination","Welche Abstimmung ist absehbar?",["Ein Team","Mehrere Teams","Externe Beteiligte"]],["needed","Gewünschter Termin","date"]], next:"Ziel, Nutzen und Zuständigkeit klären und bei Bedarf zur Projektprüfung geben."}
};
const intakeLabels = Object.fromEntries(Object.values(intake).flatMap(item => item.fields).map(([key,label]) => [key,label]));
const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
const options = (values, current, labelFor = t) => values.map((value) =>
  '<option value="' + esc(value) + '"' + (value === current ? ' selected' : '') + '>' + esc(labelFor(value)) + '</option>'
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
    owner: "", requester: "LLSG-Demobenutzer", service: "ERP", sourceLanguage: "de",
    history: [systemEvent("Fiktiver Pilotfall angelegt")]
  }));
}

let tickets = [];

async function save(next) {
  try {
    await writeTickets(next);
    tickets = next;
    return true;
  } catch (error) {
    $("error").textContent = error.message === "stale" ? t("Der Datenstand wurde in einem anderen Tab geändert. Bitte lade die Seite neu und wiederhole die Änderung.") : t("Die Änderung konnte nicht gespeichert werden. Bitte prüfe den verfügbaren Browserspeicher.");
    return false;
  }
}
const number = (ticket) => "IT-" + String(ticket.number).padStart(4, "0");
const date = (value) => new Intl.DateTimeFormat(getLanguage(), {dateStyle:"short", timeStyle:"short"}).format(new Date(value));
const event = (text) => ({text, at: new Date().toISOString()});
const systemEvent = (key, values, localized) => ({...event(t(key, values)), key, values, localized});
function applyLanguage() {
  document.documentElement.lang = getLanguage();
  $("language").value = getLanguage();
  for (const selector of ["header", ".intro", ".filters", ".storage", "#rich-toolbar-template"]) {
    const node = document.querySelector(selector);
    localize(node.content ?? node);
  }
  $("metrics").setAttribute("aria-label", t("Kennzahlen"));
  $("close").setAttribute("aria-label", t("Schließen"));
  for (const [id, values] of [["type", ["Alle Typen", ...types]], ["status", ["Alle Status", ...statuses]]]) {
    const control = $(id);
    control.innerHTML = options(values, control.value);
  }
  $("notice").textContent = "";
  render();
}
$("language").onchange = () => { setLanguage($("language").value); applyLanguage(); };

const views = ["Alle Tickets", "Handlungsbedarf", "Meine Anliegen"];
function queueRank(ticket) {
  if (ticket.status === statuses[3]) return 5;
  if (ticket.status === statuses[2]) return 4;
  if (ticket.priority === priorities[3]) return 0;
  if (ticket.status === statuses[0] || !ticket.owner) return 1;
  if (ticket.decision === decisions[1]) return 2;
  return 3;
}
function incidentPriority(ticket) {
  if (ticket.type !== types[1] || !ticket.urgency) return "";
  const impact = ["Nur ich", "Ein Team", "Mehrere Teams", "Ganze Organisation"].indexOf(ticket.intakeAnswers?.impact);
  const urgency = ["Niedrig", "Normal", "Hoch", "Sofort"].indexOf(ticket.urgency);
  if (impact < 0 || urgency < 0) return "";
  const matrix = [
    [0, 1, 1, 2],
    [1, 1, 2, 2],
    [1, 2, 2, 3],
    [2, 2, 3, 3]
  ];
  return priorities[matrix[impact][urgency]];
}

function render() {
  const view = $("view");
  view.innerHTML = options(views, view.value);
  const requesterFilter = $("requester-filter");
  requesterFilter.hidden = view.value !== views[2];
  const requesterNames = [...new Set(tickets.map(ticket => ticket.requester).filter(Boolean))].sort((a,b) => a.localeCompare(b,getLanguage()));
  requesterFilter.innerHTML = options(["Person auswählen", ...requesterNames], requesterFilter.value);

  const totals = [
    ["Offene Tickets", tickets.filter(t => t.status !== statuses[3]).length],
    ["Neue Tickets", tickets.filter(t => t.status === statuses[0]).length],
    ["Hohe Priorität", tickets.filter(t => t.status !== statuses[3] && priorities.indexOf(t.priority) >= 2).length],
    ["In Projektprüfung", tickets.filter(t => t.decision === decisions[1]).length]
  ];
  $("metrics").innerHTML = totals.map(([label, count]) => '<div class="metric"><strong>' + count + '</strong>' + esc(t(label)) + '</div>').join("");
  const query = $("search").value.trim().toLocaleLowerCase(getLanguage());
  const filtered = tickets.filter(t =>
    (view.value !== views[2] || (requesterFilter.selectedIndex > 0 && t.requester === requesterFilter.value)) &&
    (!$("type").selectedIndex || t.type === $("type").value) &&
    (!$("status").selectedIndex || t.status === $("status").value) &&
    [number(t), t.title, t.description, t.owner, t.service, t.requester, t.department, translate(t.service), translate(t.department), translate(t.type), translate(t.status), translate(t.priority)].join(" ").toLocaleLowerCase(getLanguage()).includes(query)
  );
  const ordered = filtered.slice().reverse();
  if (view.value === views[1]) ordered.sort((a,b) => queueRank(a) - queueRank(b) || priorities.indexOf(b.priority) - priorities.indexOf(a.priority));
  $("rows").innerHTML = ordered.map(t =>
    '<button class="row" data-number="' + t.number + '"><span><small>' + number(t) + ' · ' + esc(translate(t.service || "IT")) + '</small>' + esc(t.title) +
    '</span><span>' + esc(translate(t.type)) + '</span><span class="pill">' + esc(translate(t.status)) +
    '</span><span class="pill ' + (priorities.indexOf(t.priority) >= 2 ? "urgent" : "") + '">' + esc(translate(t.priority)) + '</span></button>'
  ).join("") || '<p class="muted empty">' + esc(t("Keine Tickets für diese Auswahl.")) + '</p>';
}

function show(kicker, title, body) {
  $("dialog-kicker").textContent = kicker;
  $("dialog-title").textContent = title;
  $("content").innerHTML = body;
  $("dialog").showModal();
}

const formEnd = () => '<div id="error" class="error" role="alert"></div><footer><button type="button" data-close>' + esc(t("Abbrechen")) + '</button><button class="primary">' + esc(t("Speichern")) + '</button></footer></form>';
const select = (label, name, values, current, labelFor) => '<label>' + esc(t(label)) + '<select name="' + name + '">' + options(values, current, labelFor) + '</select></label>';
const field = (label, name, value, extra = "") => '<label>' + esc(t(label)) + '<input name="' + name + '" value="' + esc(value) + '" ' + extra + '></label>';

function openNew() {
  show(t("TICKETANLAGE · IT"), t("Neues Anliegen"), '<form id="edit"><div class="grid">' +
    field("Betreff", "title", "", "required maxlength=120") +
    '<label>' + esc(t("Abteilung der anfragenden Person")) + ' <select name="department">' + options(["Alle Abteilungen", ...departments]) + '</select></label>' +
    '<label>' + esc(t("Anfragende Person")) + ' <select name="requester" required></select></label>' +
    '<label id="other-requester" hidden>' + esc(t("Name der anfragenden Person")) + '<input name="requesterName" maxlength="100" disabled></label>' +
    select("Sprache des Originals", "sourceLanguage", Object.keys(languages), getLanguage(), code => languages[code]) +
    select("Anliegenstyp", "type", types, types[0]) +
    select("Betroffener Service", "service", ["Noch nicht bekannt", ...services], "Noch nicht bekannt") +
    select("Dringlichkeit (Einschätzung)", "urgency", ["Niedrig", "Normal", "Hoch", "Sofort"], "Normal") +
    '<section class="wide intake-context"><p id="intake-hint" class="muted" aria-live="polite"></p><div id="intake-fields" class="grid"></div></section>' +
    '<section class="wide"><p id="description-label" class="rich-label">' + esc(t("Beschreibung")) + '</p>' +
    '<div class="rich-editor-group"><div id="description-toolbar" class="rich-toolbar" role="group" aria-label="' + esc(t("Beschreibung formatieren")) + '"></div>' +
    '<div id="description-editor" class="rich-editor rich-text" contenteditable="true" role="textbox" aria-multiline="true" aria-required="true" aria-labelledby="description-label"></div></div>' +
    '<textarea hidden id="description-input" name="description"></textarea><p id="description-status" class="rich-editor-status" role="status"></p></section>' +
    attachmentsForm() + '</div>' + formEnd());
  const editor = createRichEditor({
    box: $("description-editor"), toolbar: $("description-toolbar"),
    field: $("description-input"), status: $("description-status")
  });
  editor.setValue("");
  $("dialog").addEventListener("close", () => editor.dispose(), {once:true});
  const attachments = bindAttachments();
  const form = $("edit");
  const department = form.elements.namedItem("department");
  const requester = form.elements.namedItem("requester");
  const requesterName = form.elements.namedItem("requesterName");
  function updateRequesterInput() {
    const custom = requester.value === otherRequester;
    $("other-requester").hidden = !custom;
    requesterName.required = custom;
    requesterName.disabled = !custom;
  }
  function updateRequesterOptions() {
    const current = requester.value;
    const filtered = people.filter(person => !department.selectedIndex || person.department === department.value);
    requester.innerHTML = '<option value="">' + esc(t("Bitte auswählen")) + '</option>' +
      options([...filtered.map(person => person.name), otherRequester], current);
    updateRequesterInput();
  }
  department.onchange = updateRequesterOptions;
  requester.onchange = updateRequesterInput;
  updateRequesterOptions();
  const type = form.elements.namedItem("type");
  const drafts = new Map();
  let shown = type.value;
  function renderIntake() {
    drafts.set(shown, Object.fromEntries([...$("intake-fields").querySelectorAll("[name]")].map(control => [control.name, control.value])));
    shown = type.value;
    const definition = intake[shown];
    const values = drafts.get(shown) ?? {};
    $("intake-hint").textContent = t(definition.hint);
    $("intake-fields").innerHTML = definition.fields.map(([name, label, choices]) =>
      choices === "date" ? field(label, name, values[name], "type=date") :
      select(label, name, ["", ...choices], values[name])
    ).join("");
  }
  type.onchange = renderIntake;
  renderIntake();
  $("edit").onsubmit = async (e) => {
    e.preventDefault();
    const fields = Object.fromEntries([...new FormData(e.target)].map(([name, value]) => [name, name === "description" ? value : value.trim()]));
    const person = people.find(entry => entry.name === fields.requester);
    const requesterValue = fields.requester === otherRequester ? fields.requesterName : person?.name;
    if (!fields.title || !requesterValue || !fields.description.trim() || fields.description.length > 3000) {
      $("error").textContent = t("Bitte Betreff, anfragende Person und eine Beschreibung mit bis zu 3.000 Zeichen eingeben.");
      return;
    }
    const {title, description, type, service, urgency, department, requester, requesterName, sourceLanguage, ...answers} = fields;
    const intakeAnswers = Object.fromEntries(Object.entries(answers).filter(([,value]) => value));
    const ticket = {title, requester: requesterValue, department: person?.department ?? (department === "Alle Abteilungen" ? "" : department), description, type, service, urgency, sourceLanguage, intakeAnswers, number: Math.max(0, ...tickets.map(t => t.number)) + 1,
      descriptionFormat: editor.getFormat(), attachments: attachments(),
      status: statuses[0], priority: priorities[1], decision: decisions[0],
      reference: "", rationale: "", owner: "", history: [systemEvent("Ticket angelegt")]};
    await submit(e.target, [...tickets, ticket], t("{ticket} wurde angelegt.", {ticket:number(ticket)}));
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
function kanbanLink(value) {
  try {
    const url = new URL(value);
    return ["http://127.0.0.1:8090", "http://127.0.0.1:8091"].includes(url.origin) &&
      !url.username && !url.password && url.pathname === "/" && !url.search &&
      /^#card=[a-z0-9_-]+$/i.test(url.hash) ? url.href : "";
  } catch { return ""; }
}

function openTicket(ticket) {
  const suggested = incidentPriority(ticket);
  show(number(ticket) + " · IT", ticket.title,
    '<p class="muted">' + esc(ticket.requester) + (ticket.department ? ' · ' + esc(t(ticket.department)) : '') + ' · ' + esc(t(ticket.service || "IT")) + (ticket.urgency ? " · " + t("Gemeldete Dringlichkeit") + ": " + esc(t(ticket.urgency)) : "") + '</p><p id="ticket-description" class="rich-text">' +
    '</p>' + translationPanel(ticket) + '<section class="intake-context" aria-label="' + esc(t("Erstbewertung")) + '"><p class="rich-label">' + esc(t("Nächster Schritt")) + '</p><p>' +
    esc(t(ticket.status === statuses[3] ? "Vorgang abgeschlossen." : intake[ticket.type]?.next ?? intake[types[0]].next)) + '</p>' +
    Object.entries(ticket.intakeAnswers ?? {}).map(([name,value]) =>
      '<p><strong>' + esc(t(intakeLabels[name] ?? name)) + '</strong> · ' + esc(name === "needed" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Intl.DateTimeFormat(getLanguage(), {dateStyle:"medium", timeZone:"UTC"}).format(new Date(value)) : t(value)) + '</p>'
    ).join("") + '</section><form id="edit"><div class="grid">' +
    select("Anliegenstyp", "type", types, ticket.type) + select("Bearbeitungsstatus", "status", statuses, ticket.status) +
    select("Priorität", "priority", priorities, ticket.priority) + field("Zuständige Person", "owner", ticket.owner, "maxlength=100") +
    (suggested ? '<div class="wide intake-context"><p>' +
      esc(t("Prioritätsvorschlag aus Auswirkung und Dringlichkeit: {priority}", {priority:t(suggested)})) +
      '</p><button type="button" id="apply-priority">' + esc(t("Vorschlag übernehmen")) + '</button></div>' : '') +
    select("Projektentscheidung", "decision", decisions, ticket.decision) + field("Projektreferenz", "reference", ticket.reference, "maxlength=100") +
    field("Link zur Kanban-Karte", "kanbanUrl", ticket.kanbanUrl, "type=url maxlength=300") +
    '<div class="wide kanban-actions">' +
    (kanbanLink(ticket.kanbanUrl) ? '<a href="' + esc(kanbanLink(ticket.kanbanUrl)) + '" target="_blank" rel="noopener noreferrer">' + esc(t("Kanban-Karte öffnen")) + '</a>' : '') +
    '<button type="button" id="copy-handoff">' + esc(t("Übergabe kopieren")) + '</button><span id="handoff-status" role="status"></span></div>' +
    '<label class="wide">' + esc(t("Begründung der Projektentscheidung")) + '<textarea name="rationale" rows="2" maxlength="1200">' +
    esc(ticket.rationale) + '</textarea></label><label class="wide">' + esc(t("Verlaufsnotiz")) + '<textarea name="note" rows="2" maxlength="1200"></textarea></label>' + attachmentsForm() + '</div>' +
    formEnd() + '<section class="history"><h3>' + esc(t("Verlauf")) + '</h3><ul>' + ticket.history.slice().reverse().map(entry =>
      '<li><small class="muted">' + date(entry.at) + '</small> · ' + esc(entry.key ? t(entry.key, Object.fromEntries(Object.entries(entry.values ?? {}).map(([key, value]) => [key, entry.localized?.includes(key) ? t(value) : value]))) : entry.text) + '</li>').join("") + '</ul></section>');
  appendRichText($("ticket-description"), ticket.description, ticket.descriptionFormat);
  bindTranslation(ticket);
  if (suggested) $("apply-priority").onclick = () => { $("edit").elements.namedItem("priority").value = suggested; };
  $("copy-handoff").onclick = async () => {
    const ticketUrl = new URL(location.pathname, location.origin);
    ticketUrl.hash = "ticket=" + number(ticket);
    try {
      await navigator.clipboard.writeText(number(ticket) + " · " + ticket.title + "\n" + ticketUrl.href);
      $("handoff-status").textContent = t("Ticketnummer, Betreff und Rücklink kopiert.");
    } catch {
      $("handoff-status").textContent = t("Kopieren nicht möglich.");
    }
  };
  const attachments = bindAttachments(ticket.attachments);
  $("edit").onsubmit = async (e) => {
    e.preventDefault();
    const {note, ...fields} = Object.fromEntries([...new FormData(e.target)].map(([name, value]) => [name, value.trim()]));
    if (fields.kanbanUrl && !kanbanLink(fields.kanbanUrl)) {
      $("error").textContent = t("Bitte einen Kartenlink vom lokalen Kanban-Board einfügen.");
      return;
    }
    if (fields.decision === decisions[3] && !fields.reference) {
      $("error").textContent = t("Für die Projektübernahme ist eine Projektreferenz erforderlich.");
      return;
    }
    if (fields.decision !== ticket.decision && fields.decision !== decisions[0] && !fields.rationale) {
      $("error").textContent = t("Bitte die Projektentscheidung begründen.");
      return;
    }
    const labels = {type:"Anliegenstyp", status:"Status", priority:"Priorität", owner:"Zuständigkeit", decision:"Projektentscheidung", reference:"Projektreferenz", rationale:"Projektbegründung", kanbanUrl:"Link zur Kanban-Karte"};
    const history = Object.keys(fields).filter(name => fields[name] !== (ticket[name] ?? "")).map(name =>
      systemEvent("{field} geändert: {before} → {after}", {field:labels[name], before:ticket[name] || "–", after:fields[name] || "–"},
        ["type","status","priority","decision"].includes(name) ? ["field","before","after"] : ["field"]));
    if (note) history.push(event(note));
    const files = attachments();
    const previousFiles = ticket.attachments ?? [];
    for (const file of files.filter(file => !previousFiles.includes(file))) history.push(systemEvent("Anhang hinzugefügt: {file}", {file:file.name}));
    for (const file of previousFiles.filter(file => !files.includes(file))) history.push(systemEvent("Anhang entfernt: {file}", {file:file.name}));
    if (!history.length) {
      $("dialog").close();
      return;
    }
    const updated = {...ticket, ...fields, attachments: files, history: [...ticket.history, ...history]};
    await submit(e.target, tickets.map(t => t.number === ticket.number ? updated : t), t("{ticket} wurde aktualisiert.", {ticket:number(ticket)}));
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
$("view").onchange = render;
$("requester-filter").onchange = render;
applyLanguage();
try {
  tickets = await readTickets(seed);
  render();
  const openLinkedTicket = () => {
    const match = /^#ticket=(IT-\d+)$/.exec(location.hash);
    const linked = match && tickets.find(ticket => number(ticket) === match[1]);
    if (linked && !$("dialog").open) openTicket(linked);
  };
  openLinkedTicket();
  window.addEventListener("hashchange", openLinkedTicket);
} catch {
  $("new").disabled = true;
  $("notice").textContent = t("Der Browserspeicher ist nicht verfügbar. Bitte öffne den Prototyp in einem normalen Browserfenster.");
}




