import { evidenceForm, bindEvidence, activeOutages, nextAction, answerAction, handoffText, draftDiagnosis } from "./highlights.mjs";
import { getLanguage, setLanguage, languages, localize, t, t as translate } from "./i18n.mjs";
import { translationPanel, bindTranslation, readingText, translatedTitle } from "./translation.mjs";
import { createRichEditor } from "./rich-editor.mjs";
import { appendRichText } from "./rich-text.mjs";
import { attachmentsForm, bindAttachments, downloadAttachment, readTickets, writeTickets } from "./storage.mjs";

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
const agents = ["Old Grumpy SAP Cat", "Big Joe", "Felix Klug", "Aktivrentner Joe"];
const demoRequester = "LLSG-Demobenutzer";
const isAgent = () => $("workspace").value === "it";
const departments = [...new Set(people.map(person => person.department))];
const otherRequester = "Andere Person";
const catalog = {
  "ERP-Berechtigung": {service:"Zugänge & Berechtigungen", hint:"Nenne das ERP-System, die benötigte Rolle und den gewünschten Gültigkeitszeitraum."},
  "Notebook bereitstellen": {service:"Arbeitsplatz & Hardware", hint:"Nenne Einsatzort, Einsatzbeginn und besondere Anforderungen."},
  "VPN-Zugang": {service:"Netzwerk & VPN", hint:"Nenne Gerät, Einsatzort und den benötigten Zeitraum."},
  "Gemeinsames Postfach": {service:"E-Mail & Zusammenarbeit", hint:"Nenne den gewünschten Postfachnamen und die Personen, die Zugriff brauchen."}
};
const approvalDecisions = ["Freigabe anfragen", "Genehmigen", "Ablehnen"];
const relationKinds = ["Verwandt", "Duplikat von", "Blockiert durch", "Wird behoben durch"];
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
    owner: "", requester: demoRequester, service: "ERP", sourceLanguage: "de",
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
  for (const selector of ["header", ".workspace-switch", ".intro", ".filters", ".storage", "#rich-toolbar-template"]) {
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
  if (ticket.nextAction?.state === "fails" || ticket.nextAction?.state === "works") return 0;
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

const metrics = {
  open: {label:"Offene Tickets", matches:ticket => ticket.status !== statuses[3]},
  new: {label:"Neue Tickets", matches:ticket => ticket.status === statuses[0]},
  urgent: {label:"Hoch oder kritisch", matches:ticket => ticket.status !== statuses[3] && priorities.indexOf(ticket.priority) >= 2},
  project: {label:"In Projektprüfung", matches:ticket => ticket.decision === decisions[1]}
};
let activeMetric = "";
$("metrics").innerHTML = Object.keys(metrics).map(key =>
  '<button type="button" class="metric" data-metric="' + key + '" aria-pressed="false" aria-controls="rows"><strong></strong><span></span></button>'
).join("");
$("metrics").onclick = event => {
  const button = event.target.closest("[data-metric]");
  if (!button) return;
  activeMetric = activeMetric === button.dataset.metric ? "" : button.dataset.metric;
  render();
};
$("clear-metric").onclick = () => {
  const button = $("metrics").querySelector('[data-metric="' + activeMetric + '"]');
  activeMetric = "";
  render();
  button?.focus();
};

function render() {
  const agent = isAgent();
  document.body.dataset.workspace = agent ? "it" : "portal";
  const actor = $("actor");
  const requesterOptions = [...new Set([demoRequester, ...people.map(person => person.name), ...tickets.map(ticket => ticket.requester).filter(Boolean)])];
  actor.innerHTML = options(agent ? agents : requesterOptions, actor.value);
  $("actor-label").textContent = t(agent ? "IT-Mitarbeitende" : "Anfragende Person");
  $("view").hidden = !agent;
  document.querySelector(".intro h1").textContent = t(agent ? "IT-Arbeitsplatz" : "Meine Anliegen");
  document.querySelector(".intro p").textContent = t(agent ? "Anliegen aufnehmen, bewerten und weiterverfolgen." : "Melde ein Anliegen und verfolge die Rückmeldungen der IT.");
  const view = $("view");
  view.innerHTML = options(views, view.value);
  const requesterFilter = $("requester-filter");
  requesterFilter.hidden = !agent || view.value !== views[2];
  const requesterNames = [...new Set(tickets.map(ticket => ticket.requester).filter(Boolean))].sort((a,b) => a.localeCompare(b,getLanguage()));
  requesterFilter.innerHTML = options(["Person auswählen", ...requesterNames], requesterFilter.value);

  const scope = tickets.filter(ticket => agent ?
    (view.value !== views[2] || (requesterFilter.selectedIndex > 0 && ticket.requester === requesterFilter.value)) :
    ticket.requester === actor.value);
  for (const button of $("metrics").children) {
    const metric = metrics[button.dataset.metric];
    button.querySelector("strong").textContent = scope.filter(metric.matches).length;
    button.querySelector("span").textContent = t(metric.label);
    button.setAttribute("aria-pressed", String(activeMetric === button.dataset.metric));
  }
  const selected = activeMetric ? scope.filter(metrics[activeMetric].matches) : scope;
  const query = $("search").value.trim().toLocaleLowerCase(getLanguage());
  const filtered = selected.filter(t =>
    (!$("type").selectedIndex || t.type === $("type").value) &&
    (!$("status").selectedIndex || t.status === $("status").value) &&
    [number(t), t.title, t.description, t.owner, t.service, t.requester, t.department, translate(t.service), translate(t.department), translate(t.type), translate(t.status), translate(t.priority)].join(" ").toLocaleLowerCase(getLanguage()).includes(query)
  );
  $("metric-filter").hidden = !activeMetric;
  $("clear-metric").textContent = t("Kachelfilter entfernen");
  $("metric-result").textContent = activeMetric ? t("{label}: {shown} von {total} Tickets", {
    label:t(metrics[activeMetric].label), shown:filtered.length, total:selected.length
  }) : "";
  const ordered = filtered.slice().reverse();
  if (agent && view.value === views[1]) ordered.sort((a,b) => queueRank(a) - queueRank(b) || priorities.indexOf(b.priority) - priorities.indexOf(a.priority));
  $("rows").innerHTML = ordered.map(t =>
    '<button class="row" data-number="' + t.number + '"><span><small>' + number(t) + ' · ' + esc(translate(t.service || "IT")) + '</small>' + esc(translatedTitle(t)) +
    (nextAction(t) ? '<small class="action-indicator">' + esc(translate("Rückmeldung erbeten")) + '</small>' :
      t.nextAction?.state === "fails" ? '<small class="action-indicator">' + esc(translate("Fehler besteht noch")) + '</small>' :
      t.nextAction?.state === "works" ? '<small class="action-indicator">' + esc(translate("Test erfolgreich")) + '</small>' : '') +
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

const formEnd = (label = "Speichern") => '<div id="error" class="error" role="alert"></div><footer><button type="button" data-close>' + esc(t("Abbrechen")) + '</button><button class="primary">' + esc(t(label)) + '</button></footer></form>';
const select = (label, name, values, current, labelFor) => '<label>' + esc(t(label)) + '<select name="' + name + '">' + options(values, current, labelFor) + '</select></label>';
const field = (label, name, value, extra = "") => '<label>' + esc(t(label)) + '<input name="' + name + '" value="' + esc(value) + '" ' + extra + '></label>';

function openNew() {
  show(t("TICKETANLAGE · IT"), t("Neues Anliegen"), '<form id="edit"><div class="grid">' +
    field("Betreff", "title", "", "required maxlength=120") +
    '<label>' + esc(t("Abteilung der anfragenden Person")) + ' <select name="department">' + options(["Alle Abteilungen", ...departments]) + '</select></label>' +
    '<label>' + esc(t("Anfragende Person")) + ' <select name="requester" required></select></label>' +
    '<label id="other-requester" hidden>' + esc(t("Name der anfragenden Person")) + '<input name="requesterName" maxlength="100" disabled></label>' +
    select("Sprache des Originals", "sourceLanguage", Object.keys(languages), getLanguage(), code => languages[code]) +
    select("Servicekatalog", "catalogItem", ["", ...Object.keys(catalog)], "", value => t(value || "Vorlage auswählen (optional)")) +
    select("Anliegenstyp", "type", types, types[0]) +
    select("Betroffener Service", "service", ["Noch nicht bekannt", ...services], "Noch nicht bekannt") +
    select("Dringlichkeit (Einschätzung)", "urgency", ["Niedrig", "Normal", "Hoch", "Sofort"], "Normal") +
    '<section class="wide intake-context"><p id="intake-hint" class="muted" aria-live="polite"></p><div id="intake-fields" class="grid"></div></section>' +
    '<section class="wide"><p id="description-label" class="rich-label">' + esc(t("Beschreibung")) + '</p>' +
    '<div class="rich-editor-group"><div id="description-toolbar" class="rich-toolbar" role="group" aria-label="' + esc(t("Beschreibung formatieren")) + '"></div>' +
    '<div id="description-editor" class="rich-editor rich-text" contenteditable="true" role="textbox" aria-multiline="true" aria-required="true" aria-labelledby="description-label"></div></div>' +
    '<textarea hidden id="description-input" name="description"></textarea><p id="description-status" class="rich-editor-status" role="status"></p></section>' +
    '<div id="outage-suggestions" class="wide"></div>' + evidenceForm() +
    attachmentsForm() + '</div>' + formEnd());
  const editor = createRichEditor({
    box: $("description-editor"), toolbar: $("description-toolbar"),
    field: $("description-input"), status: $("description-status")
  });
  editor.setValue("");
  $("dialog").addEventListener("close", () => editor.dispose(), {once:true});
  const attachments = bindAttachments();
  bindEvidence($("dialog"), attachments.addFile);
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
  if (!isAgent()) {
    const selected = $("actor").value;
    if (people.some(person => person.name === selected)) {
      requester.value = selected;
      updateRequesterInput();
    } else {
      requester.value = otherRequester;
      requesterName.value = selected;
      updateRequesterInput();
    }
  }
  const type = form.elements.namedItem("type");
  const catalogPicker = form.elements.namedItem("catalogItem");
  const servicePicker = form.elements.namedItem("service");
  const titleInput = form.elements.namedItem("title");
  catalogPicker.onchange = () => {
    const template = catalog[catalogPicker.value];
    if (template) {
      type.value = types[2];
      servicePicker.value = template.service;
      if (!titleInput.value.trim()) titleInput.value = t(catalogPicker.value);
    }
    renderIntake();
  };
  servicePicker.onchange = () => {
    if (catalog[catalogPicker.value]?.service !== servicePicker.value) catalogPicker.value = "";
    renderIntake();
  };
  const drafts = new Map();
  let shown = type.value;
  function renderIntake() {
    drafts.set(shown, Object.fromEntries([...$("intake-fields").querySelectorAll("[name]")].map(control => [control.name, control.value])));
    shown = type.value;
    const definition = intake[shown];
    const values = drafts.get(shown) ?? {};
    const outage = $("outage-suggestions").querySelector("select")?.value;
    const matches = shown === types[1] ? activeOutages(tickets, servicePicker.value) : [];
    $("outage-suggestions").innerHTML = matches.length ? '<div class="intake-context"><p>' +
      esc(t("Bekannte Störung gefunden. Du kannst dich als betroffen melden.")) + '</p>' +
      select("Bekannte Störung", "outageTarget", ["", ...matches.map(ticket => String(ticket.number))], outage,
        value => value ? matches.find(ticket => String(ticket.number) === value).outage.title : t("Eigenes Ticket erfassen")) +
      '<button type="button" id="join-outage">' + esc(t("Ich bin betroffen")) + '</button></div>' : "";
    if (matches.length) $("join-outage").onclick = () => {
      const picker = form.elements.namedItem("outageTarget");
      if (!picker.value) picker.value = String(matches[0].number);
      const selected = matches.find(item => String(item.number) === picker.value);
      if (!titleInput.value.trim()) titleInput.value = selected.outage.title;
      if (!$("description-input").value.trim()) editor.setValue(t("Ich bin von dieser Störung betroffen."));
      form.requestSubmit();
    };
    $("intake-hint").textContent = t(catalog[catalogPicker.value]?.hint ?? definition.hint);
    $("intake-fields").innerHTML = definition.fields.map(([name, label, choices]) =>
      choices === "date" ? field(label, name, values[name], "type=date") :
      select(label, name, ["", ...choices], values[name])
    ).join("");
  }
  type.onchange = () => {
    if (type.value !== types[2]) catalogPicker.value = "";
    renderIntake();
  };
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
    const {title, description, type, service, urgency, department, requester, requesterName, sourceLanguage, catalogItem, outageTarget, ...answers} = fields;
    const incident = type === types[1] && activeOutages(tickets, service).find(item => String(item.number) === outageTarget);
    if (incident && tickets.some(item => item.relatedOutage === incident.number && item.requester === requesterValue)) {
      $("error").textContent = t("Du hast dich für diese Störung bereits als betroffen gemeldet.");
      return;
    }
    const intakeAnswers = Object.fromEntries(Object.entries(answers).filter(([,value]) => value));
    const ticket = {title, requester: requesterValue, department: person?.department ?? (department === "Alle Abteilungen" ? "" : department), description, type, service, urgency, sourceLanguage, catalogItem, intakeAnswers, relatedOutage: incident ? incident.number : null, number: Math.max(0, ...tickets.map(t => t.number)) + 1,
      descriptionFormat: editor.getFormat(), attachments: attachments(),
      status: statuses[0], priority: priorities[1], decision: decisions[0],
      reference: "", rationale: "", owner: "", history: [systemEvent("Ticket angelegt")]};
    if (!isAgent()) {
      if (![...$("actor").options].some(option => option.value === ticket.requester)) {
        $("actor").add(new Option(ticket.requester, ticket.requester));
      }
      $("actor").value = ticket.requester;
    }
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

function relationList(ticket) {
  const outgoing = (ticket.relations ?? []).map(relation => ({...relation, incoming:false}));
  const incoming = tickets.flatMap(other => (other.relations ?? []).filter(relation => relation.target === ticket.number)
    .map(relation => ({kind:relation.kind, target:other.number, incoming:true})));
  return [...outgoing, ...incoming].map(relation => {
    const related = tickets.find(other => other.number === relation.target);
    return related ? '<li>' + (relation.incoming ? '← ' : '→ ') + esc(t(relation.kind)) + ' · <button type="button" data-related="' +
      related.number + '">' + esc(number(related) + " · " + related.title) + '</button>' +
      (relation.incoming ? '' : ' <button type="button" data-unlink="' + related.number + '">' + esc(t("Beziehung entfernen")) + '</button>') +
      '</li>' : "";
  }).join("");
}

function actionDisplay(ticket, canRespond) {
  const action = ticket.nextAction;
  if (!action) return "";
  const state = {pending:"Rückmeldung erbeten",works:"Test erfolgreich",fails:"Fehler besteht noch"};
  return '<section class="intake-context action-card"><p class="rich-label">' +
    esc(t(action.kind === "acceptance" ? "Abnahme der Umsetzung" : "Nächster Schritt")) + '</p><p>' + esc(t(state[action.state])) +
    '</p><p class="rich-text">' + readingText(action.prompt,action.language) + '</p>' +
    (action.reason ? '<p class="rich-text">' + readingText(action.reason,action.answerLanguage) + '</p>' : '') +
    (canRespond && nextAction(ticket) ? '<label>' + esc(t("Was ist noch offen?")) +
      '<textarea id="action-reason" maxlength="1200" rows="2"></textarea></label><div class="kanban-actions">' +
      '<button type="button" class="primary" id="action-works">' + esc(t("Funktioniert")) + '</button>' +
      '<button type="button" id="action-fails">' + esc(t("Fehler besteht noch")) + '</button></div><p id="action-error" role="alert"></p>' : '') + '</section>';
}

function outageUpdates(ticket) {
  const linked = tickets.find(item => item.number === ticket.relatedOutage);
  if (!linked?.outage) return "";
  return '<section class="intake-context"><p class="rich-label">' + esc(t("Status der Sammelstörung")) +
    ' · ' + readingText(linked.outage.title,linked.outage.language) + '</p>' +
    (linked.outage.updates ?? []).slice().reverse().map(update =>
      '<p><small>' + esc(date(update.at)) + '</small> · ' + readingText(update.text,update.language) + '</p>').join("") + '</section>';
}

function openPortalTicket(ticket) {
  if (ticket.requester !== $("actor").value) return;
  const conversation = ticket.history.filter(entry =>
    entry.key === "{kind}: {note}" && ["Rückfrage","Antwort"].includes(entry.values?.kind));
  const attachments = (ticket.attachments ?? []).map((file, index) =>
    '<li><button type="button" data-download="' + index + '">' + esc(t("Herunterladen") + " · " + file.name) + '</button></li>').join("");
  show(number(ticket), ticket.title,
    '<p class="pill">' + esc(t(ticket.status)) + '</p><p id="ticket-description" class="rich-text"></p>' +
    actionDisplay(ticket, true) + outageUpdates(ticket) + translationPanel(ticket) + (attachments ? '<h3>' + esc(t("Anhänge")) + '</h3><ul id="portal-attachments">' + attachments + '</ul>' : '') +
    '<section class="history"><h3>' + esc(t("Kommunikation")) + '</h3><ul>' +
    conversation.map(entry => '<li><small class="muted">' + esc(date(entry.at)) + '</small> · ' +
      esc(t(entry.values.kind) + " · " + (entry.values.author ? entry.values.author + ": " : "")) + readingText(entry.values.note,entry.values.language) + '</li>').join("") +
    '</ul></section><form id="edit">' +
    select("Sprache der Nachricht", "noteLanguage", Object.keys(languages), getLanguage(), code => languages[code]) +
    '<label>' + esc(t("Antwort")) +
    '<textarea name="note" rows="3" maxlength="1200" required></textarea></label>' + formEnd("Antwort senden"));
  appendRichText($("ticket-description"), ticket.description, ticket.descriptionFormat);
  bindTranslation(ticket);
  if (nextAction(ticket)) {
    const works = $("action-works"), fails = $("action-fails"), error = $("action-error");
    const respond = async result => {
      const reason = $("action-reason").value.trim();
      if (result === "fails" && !reason) { error.textContent = t("Bitte beschreibe, was noch nicht funktioniert."); return; }
      works.disabled = fails.disabled = true;
      const action = answerAction(ticket.nextAction,result,$("actor").value,new Date().toISOString());
      if (await save(tickets.map(item => item.number === ticket.number ? {...ticket, nextAction:{...action,reason,answerLanguage:getLanguage()},
        status:statuses[1], history:[...ticket.history,systemEvent("Testergebnis: {result}", {result:result === "works" ? "Test erfolgreich" : "Fehler besteht noch"}, ["result"])]} : item))) {
        complete(t("{ticket} wurde aktualisiert.", {ticket:number(ticket)}));
      } else {
        error.textContent = $("error").textContent;
        works.disabled = fails.disabled = false;
      }
    };
    works.onclick = () => respond("works");
    fails.onclick = () => respond("fails");
  }
  if (attachments) $("portal-attachments").onclick = event => {
    const button = event.target.closest("[data-download]");
    if (button) downloadAttachment(ticket.attachments[Number(button.dataset.download)]);
  };
  $("edit").onsubmit = async event => {
    event.preventDefault();
    const note = event.target.elements.namedItem("note").value.trim();
    if (!note) return;
    const entry = systemEvent("{kind}: {note}", {kind:"Antwort",note,author:$("actor").value,language:event.target.elements.namedItem("noteLanguage").value}, ["kind"]);
    const updated = {...ticket, history:[...ticket.history,entry]};
    await submit(event.target, tickets.map(item => item.number === ticket.number ? updated : item),
      t("{ticket} wurde aktualisiert.", {ticket:number(ticket)}));
  };
}

function historyEntryText(entry) {
  const values = entry.values ?? {};
  if (values.note) return esc(t(values.kind) + ": ") + readingText(values.note,values.language);
  if (values.reason) return esc(t(values.status) + " · " + values.person + ": ") + readingText(values.reason,values.language);
  if (!entry.key) return readingText(entry.text);
  return esc(t(entry.key, Object.fromEntries(Object.entries(values).map(([key,value]) =>
    [key,entry.localized?.includes(key) ? t(value) : value]))));
}

function agentTools(ticket) {
  const affected = tickets.filter(item => item.relatedOutage === ticket.number);
  const teams = [...new Set(affected.map(item => item.department).filter(Boolean))];
  const group = (label, content) => '<fieldset class="wide feature-group"><legend>' + esc(t(label)) + '</legend><div class="grid">' + content + '</div></fieldset>';
  return group("Test und Abnahme",
    field("Bitte um einen Funktionstest", "actionRequest", "", "maxlength=500") +
    select("Kanban-Aktion", "deliveryMode", ["","prepare","accept"], "", value =>
      t({prepare:"Übergabe vorbereiten",accept:"Abnahme anfordern"}[value] ?? "Keine Änderung")) +
    field("Ziel der Umsetzung", "deliveryGoal", ticket.delivery?.goal, "maxlength=500") +
    field("Projekt", "deliveryProject", ticket.delivery?.project, "maxlength=100") +
    field("Zielspalte", "deliveryColumn", ticket.delivery?.column, "maxlength=100") +
    '<label class="wide">' + esc(t("Abnahmekriterien")) + '<textarea name="deliveryCriteria" maxlength="1200" rows="2">' + esc(ticket.delivery?.criteria) + '</textarea></label>' +
    (ticket.delivery ? '<div class="wide kanban-actions"><button type="button" id="preview-delivery">' + esc(t("Kanban-Entwurf prüfen")) +
      '</button><a href="http://127.0.0.1:8090/" target="_blank" rel="noopener noreferrer">' + esc(t("Kanban-Board öffnen")) + '</a></div>' +
      '<div class="wide" id="delivery-preview" hidden><pre id="delivery-text"></pre><button type="button" id="copy-delivery">' + esc(t("Entwurf kopieren")) +
      '</button><p id="delivery-copy-status" role="status"></p></div>' : '')) +
    group("Sammelstörung",
      select("Sammelstörungsaktion", "outageMode", ["","publish","resolve"], "", value =>
        t({publish:"Als Sammelstörung veröffentlichen",resolve:"Sammelstörung beenden"}[value] ?? "Keine Änderung")) +
      field("Öffentlicher Störungstitel", "outageTitle", ticket.outage?.title, "maxlength=120") +
      '<label class="wide">' + esc(t("Statusmeldung für Betroffene")) + '<textarea name="outageUpdate" rows="2" maxlength="1200"></textarea></label>' +
      (ticket.outage ? '<p class="wide">' + esc(t(ticket.outage.active ? "Sammelstörung aktiv" : "Sammelstörung beendet")) + ' · ' +
        esc(t("{count} betroffene Personen", {count:new Set(affected.map(item => item.requester)).size})) + ' ' + esc(teams.map(tName => t(tName)).join(", ")) + '</p>' +
        (affected.length ? '<ul class="wide">' + affected.map(item => '<li><button type="button" data-affected="' + item.number + '">' +
          esc(number(item) + " · " + item.requester + " · " + item.title) + '</button></li>').join("") + '</ul>' : '') : '')) +
    group("Diagnose und Schichtübergabe",
      '<div class="wide kanban-actions"><button type="button" id="diagnosis-draft">' + esc(t("Diagnoseentwurf anzeigen")) +
      '</button><button type="button" id="shift-brief">' + esc(t("Schichtübergabe anzeigen")) + '</button></div>' +
      '<section id="agent-draft" class="wide intake-context" aria-live="polite" hidden></section>');
}

function bindAgentTools(ticket) {
  const draft = $("agent-draft");
  const renderText = (label, text) => '<p class="rich-label">' + esc(t(label)) + '</p><p class="rich-text">' + esc(text) + '</p>';
  let pending;
  $("dialog").addEventListener("close",() => pending?.abort(),{once:true});
  $("diagnosis-draft").onclick = async () => {
    pending?.abort();
    const controller = new AbortController();
    pending = controller;
    const facts = [t(ticket.service || "IT"), ticket.description].join(" · ");
    const images = (ticket.attachments ?? []).filter(file => file.type.startsWith("image/"));
    draft.hidden = false;
    draft.innerHTML = renderText("Gemeldete Fakten",facts) +
      renderText("Offene Fragen", t(intake[ticket.type]?.hint ?? intake[types[0]].hint)) +
      (images.length ? renderText("Bildanhänge",images.map(file => file.name).join(", ")) : "");
    try {
      const result = await draftDiagnosis(ticket, controller.signal);
      if (result && !controller.signal.aborted) draft.innerHTML += renderText("KI-Entwurf (Englisch, bitte prüfen)",result);
    } catch { /* The source-based draft is already available. */ }
  };
  $("shift-brief").onclick = () => {
    pending?.abort();
    const entries = ticket.history.map((entry,index) => ({entry,index})).filter(({entry}) =>
      entry.values?.note || entry.values?.reason || entry.key === "Testergebnis: {result}").slice(-6).reverse();
    draft.hidden = false;
    draft.innerHTML = renderText("Gemeldete Fakten",ticket.description) +
      renderText("Zuständige Person",ticket.owner || "–") +
      renderText("Nächster Schritt", nextAction(ticket)?.prompt || t(intake[ticket.type]?.next ?? intake[types[0]].next)) +
      '<p class="rich-label">' + esc(t("Belegte Rückmeldungen und Entscheidungen")) + '</p>' +
      (entries.length ? '<ul>' + entries.map(({entry,index}) =>
        '<li><button type="button" data-source="' + index + '">' + esc(date(entry.at)) + '</button> ' +
        esc(entry.values.note ?? entry.values.reason ?? t(entry.values.result)) + '</li>').join("") + '</ul>' :
        '<p>' + esc(t("Noch keine Rückmeldungen oder Entscheidungen dokumentiert.")) + '</p>');
    draft.onclick = event => {
      const source = event.target.closest("[data-source]");
      if (source) {
        const row = $("history-entry-" + source.dataset.source);
        row?.scrollIntoView({block:"nearest"});
        row?.setAttribute("tabindex","-1");
        row?.focus();
      }
    };
  };
  for (const button of $("content").querySelectorAll("[data-affected]")) button.onclick = () => {
    if (!window.confirm(t("Zum verknüpften Ticket wechseln? Ungespeicherte Änderungen gehen verloren."))) return;
    const target = tickets.find(item => item.number === Number(button.dataset.affected));
    if (target) { $("dialog").close(); openTicket(target); }
  };
  if (ticket.delivery) {
    $("preview-delivery").onclick = () => {
      $("delivery-preview").hidden = !$("delivery-preview").hidden;
      $("delivery-text").textContent = handoffText(ticket,location.origin,number(ticket));
    };
    $("copy-delivery").onclick = async () => {
      const status = $("delivery-copy-status");
      try {
        await navigator.clipboard.writeText($("delivery-text").textContent);
        status.textContent = t("Kanban-Entwurf kopiert. Lege die Karte im Board an und hinterlege ihren Link.");
      } catch { status.textContent = t("Kopieren nicht möglich."); }
    };
  }
}

function openTicket(ticket) {
  if (!isAgent()) return openPortalTicket(ticket);
  const suggested = incidentPriority(ticket);
  show(number(ticket) + " · IT", ticket.title,
    '<p class="muted">' + esc(ticket.requester) + (ticket.department ? ' · ' + esc(t(ticket.department)) : '') + ' · ' + esc(t(ticket.service || "IT")) + (ticket.urgency ? " · " + t("Gemeldete Dringlichkeit") + ": " + esc(t(ticket.urgency)) : "") + '</p><p id="ticket-description" class="rich-text">' +
    '</p>' + actionDisplay(ticket, false) + translationPanel(ticket) + '<section class="intake-context" aria-label="' + esc(t("Erstbewertung")) + '"><p class="rich-label">' + esc(t("Nächster Schritt")) + '</p><p>' +
    esc(t(ticket.status === statuses[3] ? "Vorgang abgeschlossen." : intake[ticket.type]?.next ?? intake[types[0]].next)) + '</p>' +
    (ticket.rationale ? '<p><strong>' + esc(t("Projektbegründung")) + '</strong> · ' + readingText(ticket.rationale,ticket.rationaleLanguage) + '</p>' : '') +
    (ticket.delivery ? '<p><strong>' + esc(t("Ziel der Umsetzung")) + '</strong> · ' + readingText(ticket.delivery.goal,ticket.delivery.language) +
      '</p><p><strong>' + esc(t("Abnahmekriterien")) + '</strong> · ' + readingText(ticket.delivery.criteria,ticket.delivery.language) + '</p>' : '') +
    (ticket.catalogItem ? '<p><strong>' + esc(t("Servicekatalog")) + '</strong> · ' + esc(t(ticket.catalogItem)) + '</p>' : '') +
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
    esc(ticket.rationale) + '</textarea></label>' +
    '<fieldset class="wide feature-group"><legend>' + esc(t("Kommunikation")) + '</legend><div class="grid">' +
    select("Art der Rückmeldung", "noteKind", ["Rückfrage", "Antwort", "Interne Notiz"], "Interne Notiz") +
    select("Sprache der Nachricht", "noteLanguage", Object.keys(languages), getLanguage(), code => languages[code]) +
    '<label class="wide">' + esc(t("Nachricht")) + '<textarea name="note" rows="2" maxlength="1200"></textarea></label></div></fieldset>' +
    '<fieldset class="wide feature-group"><legend>' + esc(t("Freigabe")) + '</legend><div class="grid">' +
    '<p class="wide">' + esc(t(ticket.approval?.status || "Keine Freigabe erfasst")) +
    (ticket.approval?.person ? ' · ' + esc(ticket.approval.person) : '') + '</p>' +
    select("Freigabeaktion", "approvalAction", ["", ...approvalDecisions], "", value => t(value || "Keine Änderung")) +
    field("Freigebende Person", "approver", ticket.approval?.person, "maxlength=100") +
    '<label class="wide">' + esc(t("Begründung der Freigabe")) + '<textarea name="approvalReason" rows="2" maxlength="1200"></textarea></label></div></fieldset>' +
    '<fieldset class="wide feature-group"><legend>' + esc(t("Ticketbeziehungen")) + '</legend>' +
    '<ul id="ticket-relations">' + relationList(ticket) + '</ul><div class="grid">' +
    select("Beziehungstyp", "relationKind", relationKinds, relationKinds[0]) +
    select("Verknüpftes Ticket", "relationTarget", ["", ...tickets.filter(other => other.number !== ticket.number).map(other => String(other.number))],
      "", value => { const other = tickets.find(item => String(item.number) === value); return other ? number(other) + " · " + other.title : t("Ticket auswählen"); }) +
    '</div></fieldset>' + agentTools(ticket) + attachmentsForm() + '</div>' +
    formEnd() + '<section class="history"><h3>' + esc(t("Verlauf")) + '</h3><ul>' + ticket.history.slice().reverse().map(entry =>
      '<li id="history-entry-' + ticket.history.indexOf(entry) + '"><small class="muted">' + date(entry.at) + '</small> · ' + (entry.values?.author ? esc(entry.values.author) + " · " : "") + historyEntryText(entry) + '</li>').join("") + '</ul></section>');
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
  bindAgentTools(ticket);
  const attachments = bindAttachments(ticket.attachments);
  const removedLinks = new Set();
  $("ticket-relations").onclick = event => {
    const link = event.target.closest("[data-related]");
    if (link) {
      const related = tickets.find(item => item.number === Number(link.dataset.related));
      if (related && window.confirm(t("Zum verknüpften Ticket wechseln? Ungespeicherte Änderungen gehen verloren."))) {
        $("dialog").close();
        openTicket(related);
      }
    }
    const unlink = event.target.closest("[data-unlink]");
    if (unlink) {
      const target = Number(unlink.dataset.unlink);
      if (removedLinks.has(target)) removedLinks.delete(target);
      else removedLinks.add(target);
      unlink.textContent = t(removedLinks.has(target) ? "Entfernen rückgängig" : "Beziehung entfernen");
    }
  };
  $("edit").onsubmit = async (e) => {
    e.preventDefault();
    const {note, noteKind, noteLanguage, approvalAction, approver, approvalReason, relationKind, relationTarget, actionRequest, outageMode, outageTitle, outageUpdate, deliveryMode, deliveryGoal, deliveryCriteria, deliveryProject, deliveryColumn, ...fields} = Object.fromEntries([...new FormData(e.target)].map(([name, value]) => [name, value.trim()]));
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
    if (note) history.push(systemEvent("{kind}: {note}", {kind:noteKind,note,author:$("actor").value,language:noteLanguage}, ["kind"]));
    let approval = ticket.approval;
    if (approvalAction) {
      if (!approver || !approvalReason || (approvalAction !== approvalDecisions[0] && approval?.status !== "Freigabe ausstehend")) {
        $("error").textContent = t("Bitte Person und Begründung angeben. Für eine Entscheidung muss eine Freigabe offen sein.");
        return;
      }
      const status = ["Freigabe ausstehend", "Genehmigt", "Abgelehnt"][approvalDecisions.indexOf(approvalAction)];
      approval = {status, person:approver, reason:approvalReason};
      history.push(systemEvent("{status} · {person}: {reason}", {status, person:approver, reason:approvalReason,language:getLanguage()}, ["status"]));
    }
    const previousRelations = ticket.relations ?? [];
    const relations = previousRelations.filter(relation => !removedLinks.has(relation.target));
    for (const target of removedLinks) history.push(systemEvent("Beziehung entfernt: {ticket}", {ticket:number({number:target})}));
    if (relationTarget) {
      const target = tickets.find(item => item.number === Number(relationTarget));
      if (!target || target.number === ticket.number || relations.some(relation => relation.target === target.number)) {
        $("error").textContent = t("Diese Ticketbeziehung ist bereits vorhanden oder ungültig.");
        return;
      }
      relations.push({target:target.number, kind:relationKind});
      history.push(systemEvent("{kind}: {ticket}", {kind:relationKind,ticket:number(target)}, ["kind"]));
    }
    const at = new Date().toISOString();
    const actor = $("actor").value;
    let action = ticket.nextAction, outage = ticket.outage, delivery = ticket.delivery;
    if (deliveryMode) {
      if (deliveryMode === "prepare") {
        if (fields.type !== types[3] || approval?.status !== "Genehmigt" || !deliveryGoal || !deliveryCriteria) {
          $("error").textContent = t("Für die Übergabe brauchst du einen genehmigten Change, ein Ziel und Abnahmekriterien.");
          return;
        }
        delivery = {goal:deliveryGoal,criteria:deliveryCriteria,project:deliveryProject,column:deliveryColumn,language:getLanguage()};
        history.push(systemEvent("Kanban-Übergabe vorbereitet"));
      } else if (delivery && kanbanLink(fields.kanbanUrl)) {
        action = {kind:"acceptance",state:"pending",prompt:actionRequest || delivery.criteria,by:actor,at,language:actionRequest ? getLanguage() : delivery.language};
        fields.status = statuses[2];
        history.push(systemEvent("Abnahme angefordert"));
      } else {
        $("error").textContent = t("Bitte zuerst die Umsetzung vorbereiten und die Kanban-Karte verlinken.");
        return;
      }
    }
    if (actionRequest && deliveryMode !== "accept") {
      action = {kind:"check",state:"pending",prompt:actionRequest,by:actor,at,language:getLanguage()};
      fields.status = statuses[2];
      history.push(systemEvent("Test angefordert"));
    }
    if (outageMode || outageUpdate) {
      if (fields.type !== types[1] || (outageMode === "publish" && !outageTitle) ||
        (outageMode !== "publish" && !outage)) {
        $("error").textContent = t("Für eine Sammelstörung brauchst du eine Störung mit öffentlichem Titel.");
        return;
      }
      outage = {title:outageMode === "publish" ? outageTitle : outage.title,
        language:outageMode === "publish" ? getLanguage() : outage.language,
        active:outageMode === "publish" || (outageMode !== "resolve" && outage?.active), updates:[...(outage?.updates ?? [])]};
      if (outageUpdate) outage.updates.push({text:outageUpdate,at,actor,language:getLanguage()});
      history.push(systemEvent("Sammelstörung aktualisiert"));
    }
    const files = attachments();
    const previousFiles = ticket.attachments ?? [];
    for (const file of files.filter(file => !previousFiles.includes(file))) history.push(systemEvent("Anhang hinzugefügt: {file}", {file:file.name}));
    for (const file of previousFiles.filter(file => !files.includes(file))) history.push(systemEvent("Anhang entfernt: {file}", {file:file.name}));
    if (!history.length) {
      $("dialog").close();
      return;
    }
    const updated = {...ticket, ...fields, rationaleLanguage: fields.rationale === ticket.rationale ? ticket.rationaleLanguage : getLanguage(), attachments: files, approval, relations, nextAction:action, outage, delivery, history: [...ticket.history, ...history]};
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
$("dialog").addEventListener("close",render);
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
$("workspace").onchange = () => { activeMetric = ""; render(); };
$("actor").onchange = render;
applyLanguage();
$("language").disabled = false;
try {
  tickets = await readTickets(seed);
  render();
  $("new").disabled = false;
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









