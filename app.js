import { serviceDeadlines, deadlineRank, matchingArticles } from "./operations.mjs";
import { evidenceForm, bindEvidence, activeOutages, nextAction, answerAction, handoffText, draftDiagnosis } from "./highlights.mjs";
import { getLanguage, setLanguage, languages, localize, t, t as translate, uiText, localizeUI, labelKey, markStaticUI } from "./i18n.mjs";
import { translationPanel, bindTranslation, readingText, translatedTitle, translateTicketTitles } from "./translation.mjs";
import { createRichEditor } from "./rich-editor.mjs";
import { appendRichText } from "./rich-text.mjs";
import { attachmentsForm, bindAttachments, downloadAttachment, readTickets, writeTickets } from "./storage.mjs";

"use strict";

const types = ["Noch nicht eingeordnet", "Störung", "Serviceanfrage", "Änderungsantrag", "Neues Vorhaben", "Problem"];
const statuses = ["Neu", "In Bearbeitung", "Wartet auf Rückmeldung", "Abgeschlossen"];
const priorities = ["Niedrig", "Normal", "Hoch", "Kritisch"];
const decisions = ["Nicht beantragt", "In Prüfung", "Abgelehnt", "Als Projekt übernommen"];
const services = ["ERP", "Arbeitsplatz & Hardware", "Zugänge & Berechtigungen", "E-Mail & Zusammenarbeit", "Netzwerk & VPN", "Sonstiger IT-Service"];
const sapSteps = {
  "Beschaffung bis Zahlung":["Bestellung anlegen oder freigeben","Wareneingang buchen","Qualitätsprüfung durchführen","Lieferantenrechnung prüfen oder buchen"],
  "Auftrag bis Zahlung":["Kundenauftrag bearbeiten","Lieferung und Warenausgang","Fakturierung"],
  "Finanzabschluss":["Sachkontenbuchung","Abschluss und Abstimmung"],
  "Planung und Produktion":["Materialbedarf planen","Fertigungsauftrag bearbeiten"],
  "Technischer Betrieb":["Schnittstelle oder Hintergrundjob"]
};
const sapProcesses = Object.keys(sapSteps);
const sapComponents = ["FI","CO","MM","QM","SD","PP","Basis"];
const sapStepContext = {
  "Bestellung anlegen oder freigeben":"Bestellung oder Bestellanforderung",
  "Wareneingang buchen":"Werk und Bestellposition",
  "Qualitätsprüfung durchführen":"Werk und Prüflos",
  "Lieferantenrechnung prüfen oder buchen":"Buchungskreis und Rechnungsreferenz"
};
const areaServices = {
  IT:services, HR:["Personalbescheinigung","Eintritt und Austritt"],
  Marketing:["Marketingmaterial","Kampagnenunterstützung"],
  Einkauf:["Beschaffungsanfrage","Lieferantenanlage"]
};
const areas = Object.keys(areaServices);
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
  "ERP-Berechtigung": {service:"ERP", owner:"Old Grumpy SAP Cat", hint:"Nenne die benötigte SAP-Rolle, das Zielsystem und den Gültigkeitszeitraum."},
  "Lieferantenrechnung kann nicht gebucht werden": {service:"ERP", type:"Störung", process:sapProcesses[0], step:sapSteps[sapProcesses[0]][3], hint:"Nenne den Buchungskreis, die Fiori-App oder Transaktion und die genaue Fehlermeldung."},
  "Wareneingang kann nicht gebucht werden": {service:"ERP", type:"Störung", process:sapProcesses[0], step:sapSteps[sapProcesses[0]][1], hint:"Nenne Werk, Bestellposition und Fehlermeldung beim Wareneingang."},
  "Prüflos fehlt oder Verwendungsentscheid ist blockiert": {service:"ERP", type:"Störung", process:sapProcesses[0], step:sapSteps[sapProcesses[0]][2], hint:"Nenne Werk, Prüflos und den Schritt, an dem die Qualitätsprüfung stockt."},
  "Freigaberegel für Bestellungen ändern": {service:"ERP", type:"Änderungsantrag", process:sapProcesses[0], step:sapSteps[sapProcesses[0]][0], hint:"Beschreibe den heutigen Freigabeweg, die gewünschte Regel und ein Abnahmebeispiel."},
  "SAP-Schnittstelle oder Hintergrundjob gestört": {service:"ERP", type:"Störung", process:sapProcesses[4], step:sapSteps[sapProcesses[4]][0], hint:"Nenne Schnittstelle oder Job, Zeitpunkt und die Auswirkung auf den Geschäftsprozess."},
  "Notebook bereitstellen": {service:"Arbeitsplatz & Hardware", owner:"Felix Klug", hint:"Nenne Einsatzort, Einsatzbeginn und besondere Anforderungen."},
  "VPN-Zugang": {service:"Netzwerk & VPN", owner:"Aktivrentner Joe", hint:"Nenne Gerät, Einsatzort und den benötigten Zeitraum."},
  "Gemeinsames Postfach": {service:"E-Mail & Zusammenarbeit", owner:"Felix Klug", hint:"Nenne den gewünschten Postfachnamen und die Personen, die Zugriff brauchen."}
};
const approvalDecisions = ["Freigabe anfragen", "Genehmigen", "Ablehnen"];
const relationKinds = ["Verwandt", "Duplikat von", "Blockiert durch", "Wird behoben durch", "Ursache untersucht in", "Dauerhafte Korrektur"];
const intake = {
  "Problem": {hint:"Dokumentiere wiederkehrende Störungen und die vermutete Ursache.", fields:[], next:"Ursache untersuchen und einen dauerhaften Change verknüpfen."},
  "Noch nicht eingeordnet": {hint:"Beschreibe dein Anliegen in eigenen Worten. Die IT übernimmt die Einordnung.", fields:[], next:"Anliegen sichten und einem Bearbeitungsweg zuordnen."},
  "Störung": {hint:"Beschreibe, was ausgefallen ist und wie stark die Arbeit betroffen ist.", fields:[["impact","Wer ist betroffen?",["Nur ich","Ein Team","Mehrere Teams","Ganze Organisation"]],["workaround","Gibt es einen Ausweichweg?",["Ja","Nein"]]], next:"Auswirkung und Dringlichkeit prüfen und den Betrieb wiederherstellen."},
  "Serviceanfrage": {hint:"Gib an, für wen und bis wann die Leistung gebraucht wird.", fields:[["beneficiary","Für wen ist die Anfrage?",["Für mich","Für eine andere Person","Für ein Team"]],["needed","Benötigt bis","date"]], next:"Standardleistung und erforderliche Freigabe prüfen."},
  "Änderungsantrag": {hint:"Beschreibe den heutigen Zustand und das gewünschte Ergebnis.", fields:[["changeScope","Welche Art von Änderung?",["Konfiguration","Funktionserweiterung","Schnittstelle","Sonstiges"]],["needed","Gewünschter Termin","date"]], next:"Auswirkungen und Risiken bewerten und über Freigabe oder Projektprüfung entscheiden."},
  "Neues Vorhaben": {hint:"Beschreibe das angestrebte Ergebnis und wer davon profitiert.", fields:[["coordination","Welche Abstimmung ist absehbar?",["Ein Team","Mehrere Teams","Externe Beteiligte"]],["needed","Gewünschter Termin","date"]], next:"Ziel, Nutzen und Zuständigkeit klären und bei Bedarf zur Projektprüfung geben."}
};
const intakeLabels = Object.fromEntries(Object.values(intake).flatMap(item => item.fields).map(([key,label]) => [key,label]));
const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
const options = (values, current, labelFor = t) => values.map(value => {
  const label = labelFor(value);
  const key = labelFor === t ? value : labelKey(label);
  return '<option value="' + esc(value) + '" data-ui-key="' + esc(key) + '"' +
    (value === current ? ' selected' : '') + '>' + esc(label) + '</option>';
}).join("");

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

async function save(next, errorOutput = $("error")) {
  try {
    await writeTickets(next);
    tickets = next;
    return true;
  } catch (error) {
    errorOutput.textContent = error.message === "stale" ? t("Der Datenstand wurde in einem anderen Tab geändert. Bitte lade die Seite neu und wiederhole die Änderung.") : t("Die Änderung konnte nicht gespeichert werden. Bitte prüfe den verfügbaren Browserspeicher.");
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
  localizeUI($("dialog"));
  render();
}
function switchLanguage(language) {
  setLanguage(language);
  applyLanguage();
  document.dispatchEvent(new Event("llsg-language-change"));
}
$("language").onchange = () => switchLanguage($("language").value);

const views = ["Alle Tickets", "Handlungsbedarf", "Meine Anliegen", "Meine IT-Aufgaben"];
function queueRank(ticket) {
  if (ticket.status === statuses[3]) return 5;
  if (ticket.escalation) return 0;
  if (ticket.nextAction?.state === "fails" || ticket.nextAction?.state === "works") return 0;
  if (ticket.status === statuses[2]) return 4;
  if (ticket.priority === priorities[3]) return 0;
  if (ticket.status === statuses[0] || !ticket.owner) return 1;
  if (ticket.decision === decisions[1]) return 2;
  return 3;
}
function incidentPriority(ticket) {
  if (ticket.type !== types[1] || !ticket.urgency) return "";
  const impact = ["Nur ich", "Ein Team", "Mehrere Teams", "Ganze Organisation"].indexOf(ticket.businessScope || ticket.intakeAnswers?.impact);
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
  const areaFilter = $("area-filter");
  areaFilter.hidden = !agent;
  areaFilter.innerHTML = options(["Alle Servicebereiche", ...areas], areaFilter.value);
  document.querySelector(".intro h1").textContent = t(agent ? "IT-Arbeitsplatz" : "Meine Anliegen");
  document.querySelector(".intro p").textContent = t(agent ? "Anliegen aufnehmen, bewerten und weiterverfolgen." : "Melde ein Anliegen und verfolge die Rückmeldungen der IT.");
  const view = $("view");
  view.innerHTML = options(views, view.value);
  const requesterFilter = $("requester-filter");
  requesterFilter.hidden = !agent || view.value !== views[2];
  const requesterNames = [...new Set(tickets.map(ticket => ticket.requester).filter(Boolean))].sort((a,b) => a.localeCompare(b,getLanguage()));
  requesterFilter.innerHTML = options(["Person auswählen", ...requesterNames], requesterFilter.value);

  const scope = tickets.filter(ticket => agent ?
    (!areaFilter.selectedIndex || (ticket.area || "IT") === areaFilter.value) &&
    (view.value !== views[2] || (requesterFilter.selectedIndex > 0 && ticket.requester === requesterFilter.value)) &&
    (view.value !== views[3] || ((ticket.owner || ticket.nextAction?.by) === actor.value && ![statuses[2],statuses[3]].includes(ticket.status))) :
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
    [number(t), t.title, translatedTitle(t), t.description, t.owner, t.service, t.requester, t.department, t.system, t.sapProcess, t.sapStep, t.sapComponent, t.sapContext, t.sapApp, t.sapError, translate(t.sapStep), translate(t.sapProcess), translate(t.service), translate(t.department), translate(t.type), translate(t.status), translate(t.priority)].join(" ").toLocaleLowerCase(getLanguage()).includes(query)
  );
  $("metric-filter").hidden = !activeMetric;
  $("clear-metric").textContent = t("Kachelfilter entfernen");
  $("metric-result").textContent = activeMetric ? t("{label}: {shown} von {total} Tickets", {
    label:t(metrics[activeMetric].label), shown:filtered.length, total:selected.length
  }) : "";
  const ordered = filtered.slice().reverse();
  if (agent && [views[1],views[3]].includes(view.value)) ordered.sort((a,b) => deadlineRank(a) - deadlineRank(b) || queueRank(a) - queueRank(b) || priorities.indexOf(b.priority) - priorities.indexOf(a.priority));
  $("rows").innerHTML = ordered.map(t =>
    '<button class="row" data-number="' + t.number + '"><span><small>' + number(t) + ' · ' + esc(translate(t.service || "IT")) + '</small>' + '<span class="ticket-row-title">' + esc(translatedTitle(t)) + '</span>' +
    (agent && deadlineRank(t) < 2 ? '<small class="action-indicator">' + esc(translate(deadlineRank(t) === 0 ? "Überfällig" : "Frist naht")) + '</small>' : '') +
    (nextAction(t) ? '<small class="action-indicator">' + esc(translate("Rückmeldung erbeten")) + '</small>' :
      t.nextAction?.state === "fails" ? '<small class="action-indicator">' + esc(translate("Fehler besteht noch")) + '</small>' :
      t.nextAction?.state === "works" ? '<small class="action-indicator">' + esc(translate("Test erfolgreich")) + '</small>' : '') +
    '</span><span>' + esc(translate(t.type)) + '</span><span class="pill">' + esc(translate(t.status)) +
    '</span><span class="pill ' + (priorities.indexOf(t.priority) >= 2 ? "urgent" : "") + '">' + esc(translate(t.priority)) + '</span></button>'
  ).join("") || (!agent && !scope.length ?
    '<div class="empty"><p class="muted">' + uiText("Für diese Person gibt es noch keine eigenen Anliegen.") + '</p>' +
    '<div class="kanban-actions"><button type="button" data-open-it>' + uiText("Zum IT-Arbeitsplatz und alle Tickets anzeigen") + '</button></div></div>' :
    '<p class="muted empty">' + uiText("Keine Tickets für diese Auswahl.") + '</p>');
  const targetLanguage = getLanguage();
  void translateTicketTitles(ordered,targetLanguage,(ticket,value) => {
    if (getLanguage() !== targetLanguage || !tickets.includes(ticket)) return;
    const title = $("rows").querySelector('[data-number="' + ticket.number + '"] .ticket-row-title');
    if (title) {
      title.textContent = value;
      title.lang = targetLanguage;
    }
  });
}

function show(kicker, title, body) {
  $("dialog-reading-language").replaceChildren();
  $("edit-ticket").hidden = true;
  $("edit-ticket").onclick = null;
  $("dialog-kicker").textContent = kicker;
  $("dialog-title").textContent = title;
  delete $("dialog-title").dataset.uiKey;
  delete $("dialog-kicker").dataset.uiKey;
  $("content").innerHTML = body;
  for (const element of $("content").querySelectorAll("[aria-label], [placeholder], [title]")) {
    for (const name of ["aria-label", "placeholder", "title"]) {
      if (element.hasAttribute(name)) element.setAttribute("data-ui-" + name, labelKey(element.getAttribute(name)));
    }
  }
  $("dialog").showModal();
}

const formEnd = (label = "Speichern") => '<div id="error" class="error" role="alert"></div><footer><button type="button" data-close>' + uiText("Abbrechen") + '</button><button class="primary">' + uiText(label) + '</button></footer></form>';
const select = (label, name, values, current, labelFor) => '<label>' + uiText(label) + '<select name="' + name + '">' + options(values, current, labelFor) + '</select></label>';
const field = (label, name, value, extra = "") => '<label>' + uiText(label) + '<input name="' + name + '" value="' + esc(value) + '" ' + extra + '></label>';

function sapFields(process, step, context, app, error) {
  const known = Object.hasOwn(sapSteps, process);
  const processOptions = process && !known ? [...sapProcesses, process] : sapProcesses;
  return '<div class="grid">' +
    select("SAP-Geschäftsprozess", "sapProcess", ["", ...processOptions], process, value => t(value || "Noch nicht bekannt")) +
    select("Prozessschritt", "sapStep", ["", ...(known ? sapSteps[process] : [])], step, value => t(value || "Noch nicht bekannt")) +
    '<label><span id="sap-context-label">' + uiText(sapStepContext[step] ?? "Organisation und Belegreferenz") +
    '</span><input name="sapContext" value="' + esc(context) + '" maxlength="160"></label>' +
    field("Fiori-App oder Transaktion", "sapApp", app, "maxlength=120") +
    field("Fehlermeldung", "sapError", error, "maxlength=500") + '</div>';
}

function bindSapFields(form) {
  const process = form.elements.namedItem("sapProcess");
  if (!process) return;
  const step = form.elements.namedItem("sapStep");
  function updateContextLabel() {
    $("sap-context-label").innerHTML = uiText(sapStepContext[step.value] ?? "Organisation und Belegreferenz");
  }
  process.onchange = () => {
    step.innerHTML = options(["", ...(sapSteps[process.value] ?? [])], "", value => t(value || "Noch nicht bekannt"));
    updateContextLabel();
  };
  step.onchange = updateContextLabel;
}

function descriptionEditorMarkup() {
  return '<section class="wide"><p id="description-label" class="rich-label">' + uiText("Beschreibung") + '</p>' +
    '<div class="rich-editor-group"><div id="description-toolbar" class="rich-toolbar" role="group" aria-label="' + esc(t("Beschreibung formatieren")) + '"></div>' +
    '<div id="description-editor" class="rich-editor rich-text" contenteditable="true" role="textbox" aria-multiline="true" aria-required="true" aria-labelledby="description-label"></div></div>' +
    '<textarea hidden id="description-input" name="description"></textarea><p id="description-status" class="rich-editor-status" role="status"></p></section>';
}

const businessContextLabels = {
  businessImpact:"Geschäftliche Auswirkungen",
  businessScope:"Wer ist betroffen?",
  reportedCriticality:"Gemeldete Kritikalität",
  desiredOutcome:"Gewünschtes Ergebnis",
  businessDeadline:"Benötigt bis",
  currentWorkaround:"Aktueller Ausweichweg"
};
const reportedUrgencies = ["Niedrig", "Normal", "Hoch", "Sofort"];

function businessContextFields(ticket = {}) {
  const textarea = name => '<label>' + uiText(businessContextLabels[name]) + '<textarea name="' + name +
    '" rows="2" maxlength="1200">' + esc(ticket[name]) + '</textarea></label>';
  return '<fieldset class="wide feature-group"><legend>' + uiText("Zusatzinformationen und Auswirkungen") + '</legend><div class="grid">' +
    select("Gemeldete Kritikalität", "reportedCriticality", ["", ...priorities], ticket.reportedCriticality ?? "", value => t(value || "Noch nicht bewertet")) +
    select("Wer ist betroffen?", "businessScope", ["", "Nur ich", "Ein Team", "Mehrere Teams", "Ganze Organisation"],
      ticket.businessScope || ticket.intakeAnswers?.impact || "", value => t(value || "Noch nicht bekannt")) +
    textarea("businessImpact") + textarea("desiredOutcome") +
    field(businessContextLabels.businessDeadline, "businessDeadline", ticket.businessDeadline, "type=date") +
    textarea("currentWorkaround") + '</div></fieldset>';
}

function businessContextDisplay(ticket) {
  const rows = Object.entries(businessContextLabels).filter(([name]) => name !== "reportedCriticality" && ticket[name]).map(([name, label]) =>
    '<div><dt>' + uiText(label) + '</dt><dd class="rich-text">' +
    (name === "businessDeadline" || name === "businessScope" ? uiText(ticket[name]) : readingText(ticket[name], ticket.businessContextLanguages?.[name])) + '</dd></div>');
  return rows.length ? '<dl class="ticket-facts">' + rows.join("") + '</dl>' : "";
}

function bindDescriptionEditor(ticket) {
  const editor = createRichEditor({
    box: $("description-editor"), toolbar: $("description-toolbar"),
    field: $("description-input"), status: $("description-status")
  });
  editor.setValue(ticket?.description ?? "", ticket?.descriptionFormat);
  $("dialog").addEventListener("close", () => editor.dispose(), {once:true});
  return editor;
}

function openNew() {
  show(t("TICKETANLAGE · IT"), t("Neues Anliegen"), '<form id="edit"><div class="grid">' +
    field("Betreff", "title", "", "required maxlength=120") +
    '<label>' + uiText("Abteilung der anfragenden Person") + ' <select name="department">' + options(["Alle Abteilungen", ...departments]) + '</select></label>' +
    '<label>' + uiText("Anfragende Person") + ' <select name="requester" required></select></label>' +
    '<label id="other-requester" hidden>' + uiText("Name der anfragenden Person") + '<input name="requesterName" maxlength="100" disabled></label>' +
    select("Sprache des Originals", "sourceLanguage", Object.keys(languages), getLanguage(), code => languages[code]) +
    select("Servicebereich", "area", areas, "IT") +
    select("Servicekatalog", "catalogItem", ["", ...Object.keys(catalog)], "", value => t(value || "Vorlage auswählen (optional)")) +
    select("Anliegenstyp", "type", isAgent() ? types : types.slice(0,5), types[0]) +
    '<div id="sap-process" class="wide"></div>' + field("System oder Gerät", "system", "", "maxlength=120") +
    select("Betroffener Service", "service", ["Noch nicht bekannt", ...services], "Noch nicht bekannt") +
    select("Dringlichkeit (Einschätzung)", "urgency", reportedUrgencies, "Normal") +
    '<section class="wide intake-context"><p id="intake-hint" class="muted" aria-live="polite"></p><div id="intake-fields" class="grid"></div></section>' +
    descriptionEditorMarkup() + businessContextFields() +
    '<div id="knowledge-suggestions" class="wide"></div><div id="outage-suggestions" class="wide"></div>' + evidenceForm() +
    attachmentsForm() + '</div>' + formEnd());
  $("dialog-title").dataset.uiKey = "Neues Anliegen";
  $("dialog-kicker").dataset.uiKey = "TICKETANLAGE · IT";
  const editor = bindDescriptionEditor();
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
  const areaPicker = form.elements.namedItem("area");
  areaPicker.onchange = () => {
    const isIT = areaPicker.value === "IT";
    catalogPicker.closest("label").hidden = !isIT;
    catalogPicker.value = "";
    servicePicker.innerHTML = options(["Noch nicht bekannt", ...areaServices[areaPicker.value]], "Noch nicht bekannt");
    renderIntake();
  };
  let generatedTitle = "";
  catalogPicker.onchange = () => {
    const template = catalog[catalogPicker.value];
    if (template) {
      type.value = template.type ?? types[2];
      servicePicker.value = template.service;
      if (!titleInput.value.trim() || titleInput.value === generatedTitle) {
        generatedTitle = form.elements.namedItem("sourceLanguage").value === getLanguage() ? t(catalogPicker.value) : "";
        titleInput.value = generatedTitle;
      }
    }
    renderIntake(template);
  };
  servicePicker.onchange = () => {
    if (catalog[catalogPicker.value]?.service !== servicePicker.value) catalogPicker.value = "";
    renderIntake();
  };
  const drafts = new Map();
  let shown = type.value;
  titleInput.addEventListener("input",renderKnowledge);
  function renderKnowledge() {
    const articles = matchingArticles(tickets,servicePicker.value,titleInput.value,areaPicker.value);
    $("knowledge-suggestions").innerHTML = articles.length ? '<div class="intake-context"><p class="rich-label">' + uiText("Passende Hilfeartikel") + '</p>' + articles.map(article => '<details><summary>' + esc(article.title) + '</summary><p class="rich-text">' + esc(article.body) + '</p></details>').join("") + '</div>' : "";
  }
  function renderIntake(template) {
    const processField = $("sap-process");
    const fields = form.elements;
    const process = template?.process ?? fields.namedItem("sapProcess")?.value ?? "";
    const step = template?.step ?? fields.namedItem("sapStep")?.value ?? "";
    const context = fields.namedItem("sapContext")?.value ?? "";
    const app = fields.namedItem("sapApp")?.value ?? "";
    const error = fields.namedItem("sapError")?.value ?? "";
    const isSap = servicePicker.value === "ERP";
    processField.hidden = !isSap;
    processField.innerHTML = isSap ? sapFields(process, step, context, app, error) : "";
    if (isSap) bindSapFields(form);
    renderKnowledge();
    drafts.set(shown, Object.fromEntries([...$("intake-fields").querySelectorAll("[name]")].map(control => [control.name, control.value])));
    shown = type.value;
    const definition = intake[shown];
    const values = drafts.get(shown) ?? {};
    const outage = $("outage-suggestions").querySelector("select")?.value;
    const matches = shown === types[1] ? activeOutages(tickets.filter(item => (item.area || "IT") === areaPicker.value), servicePicker.value) : [];
    $("outage-suggestions").innerHTML = matches.length ? '<div class="intake-context"><p>' +
      uiText("Bekannte Störung gefunden. Du kannst dich als betroffen melden.") + '</p>' +
      select("Bekannte Störung", "outageTarget", ["", ...matches.map(ticket => String(ticket.number))], outage,
        value => value ? matches.find(ticket => String(ticket.number) === value).outage.title : t("Eigenes Ticket erfassen")) +
      '<button type="button" id="join-outage">' + uiText("Ich bin betroffen") + '</button></div>' : "";
    if (matches.length) $("join-outage").onclick = () => {
      const picker = form.elements.namedItem("outageTarget");
      if (!picker.value) picker.value = String(matches[0].number);
      const selected = matches.find(item => String(item.number) === picker.value);
      if (!titleInput.value.trim()) titleInput.value = selected.outage.title;
      if (!$("description-input").value.trim()) editor.setValue(t("Ich bin von dieser Störung betroffen."));
      form.requestSubmit();
    };
    $("intake-hint").innerHTML = uiText(catalog[catalogPicker.value]?.hint ?? definition.hint);
    $("intake-fields").innerHTML = definition.fields.filter(([name]) => name !== "impact").map(([name, label, choices]) =>
      choices === "date" ? field(label, name, values[name], "type=date") :
      select(label, name, ["", ...choices], values[name])
    ).join("");
  }
  type.onchange = () => {
    if ((catalog[catalogPicker.value]?.type ?? types[2]) !== type.value) catalogPicker.value = "";
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
    const {title, description, type, service, urgency, department, requester, requesterName, sourceLanguage, catalogItem, outageTarget, system, area, sapProcess, sapStep, sapContext, sapApp, sapError, businessImpact, businessScope, reportedCriticality, desiredOutcome, businessDeadline, currentWorkaround, ...answers} = fields;
    const incident = type === types[1] && activeOutages(tickets.filter(item => (item.area || "IT") === area), service).find(item => String(item.number) === outageTarget);
    if (incident && tickets.some(item => item.relatedOutage === incident.number && item.requester === requesterValue)) {
      $("error").textContent = t("Du hast dich für diese Störung bereits als betroffen gemeldet.");
      return;
    }
    const intakeAnswers = Object.fromEntries(Object.entries(answers).filter(([,value]) => value));
    const ticket = {title, requester: requesterValue, department: person?.department ?? (department === "Alle Abteilungen" ? "" : department), description, type, service, urgency, sourceLanguage, catalogItem, system, area, sapProcess, sapStep, sapContext, sapApp, sapError, businessImpact, businessScope, reportedCriticality, desiredOutcome, businessDeadline, currentWorkaround, intakeAnswers, createdAt:new Date().toISOString(), relatedOutage: incident ? incident.number : null, number: Math.max(0, ...tickets.map(t => t.number)) + 1,
      descriptionFormat: editor.getFormat(), attachments: attachments(),
      status: statuses[0], priority: priorities[1], decision: decisions[0],
      reference: "", rationale: "", owner:catalog[catalogItem]?.owner ?? "", history: [systemEvent("Ticket angelegt")]};
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
    if (await save(next, form.querySelector("[data-edit-error]") ?? $("error"))) complete(message);
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
    return related ? '<li>' + (relation.incoming ? '← ' : '→ ') + uiText(relation.kind) + ' · <button type="button" data-related="' +
      related.number + '">' + esc(number(related) + " · " + related.title) + '</button>' +
      (relation.incoming ? '' : ' <button type="button" data-unlink="' + related.number + '">' + uiText("Beziehung entfernen") + '</button>') +
      '</li>' : "";
  }).join("");
}

function actionDisplay(ticket, canRespond) {
  const action = ticket.nextAction;
  if (!action) return "";
  const state = {pending:"Rückmeldung erbeten",works:"Test erfolgreich",fails:"Fehler besteht noch"};
  return '<section class="intake-context action-card"><p class="rich-label">' +
    uiText(action.kind === "acceptance" ? "Abnahme der Umsetzung" : "Nächster Schritt") + '</p><p>' + uiText(state[action.state]) +
    '</p><p class="rich-text">' + readingText(action.prompt,action.language) + '</p>' +
    (action.reason ? '<p class="rich-text">' + readingText(action.reason,action.answerLanguage) + '</p>' : '') +
    (canRespond && nextAction(ticket) ? '<label>' + uiText("Was ist noch offen?") +
      '<textarea id="action-reason" maxlength="1200" rows="2"></textarea></label><div class="kanban-actions">' +
      '<button type="button" class="primary" id="action-works">' + uiText("Funktioniert") + '</button>' +
      '<button type="button" id="action-fails">' + uiText("Fehler besteht noch") + '</button></div><p id="action-error" role="alert"></p>' : '') + '</section>';
}

function outageUpdates(ticket) {
  const linked = tickets.find(item => item.number === ticket.relatedOutage);
  if (!linked?.outage) return "";
  return '<section class="intake-context"><p class="rich-label">' + uiText("Status der Sammelstörung") +
    ' · ' + readingText(linked.outage.title,linked.outage.language) + '</p>' +
    (linked.outage.updates ?? []).slice().reverse().map(update =>
      '<p><small>' + esc(date(update.at)) + '</small> · ' + readingText(update.text,update.language) + '</p>').join("") + '</section>';
}

function portalEditMarkup(ticket) {
  return '<details class="portal-editor" id="portal-editor"><summary>' + uiText("Ticket bearbeiten oder ergänzen") + '</summary>' +
    '<form id="portal-edit"><div class="grid">' +
    field("Betreff", "title", ticket.title, "required maxlength=120") +
    select("Sprache des Originals", "sourceLanguage", ["", ...Object.keys(languages)], ticket.sourceLanguage ?? "",
      code => languages[code] ?? t("Originalsprache unbekannt")) +
    select("Dringlichkeit (Einschätzung)", "urgency", ["", ...reportedUrgencies], ticket.urgency ?? "", value => t(value || "Noch nicht bekannt")) +
    select("Servicebereich", "area", areas, ticket.area || "IT") +
    select("Betroffener Service", "service", [...new Set(["Noch nicht bekannt", ...(areaServices[ticket.area || "IT"] ?? []), ticket.service].filter(Boolean))], ticket.service || "Noch nicht bekannt") +
    select("Anliegenstyp", "type", [...new Set([...types.slice(0,5),ticket.type].filter(Boolean))], ticket.type) +
    field("System oder Gerät", "system", ticket.system, "maxlength=120") +
    '<div id="portal-sap-fields" class="wide"' + (ticket.service === "ERP" ? "" : " hidden") + '>' +
    (ticket.service === "ERP" ? sapFields(ticket.sapProcess,ticket.sapStep,ticket.sapContext,ticket.sapApp,ticket.sapError) : "") + '</div>' +
    descriptionEditorMarkup() + businessContextFields(ticket) + evidenceForm() + attachmentsForm() +
    '</div><p data-edit-error class="error" role="alert"></p><footer><button type="submit" class="primary">' +
    uiText("Änderungen speichern") + '</button></footer></form></details>';
}

function bindPortalEditor(ticket) {
  const panel = $("portal-editor");
  const form = $("portal-edit");
  const error = form.querySelector("[data-edit-error]");
  const service = form.elements.namedItem("service");
  const area = form.elements.namedItem("area");
  const sap = $("portal-sap-fields");
  const showSapFields = () => {
    if (service.value === "ERP" && !sap.hasChildNodes()) {
      sap.innerHTML = sapFields(ticket.sapProcess,ticket.sapStep,ticket.sapContext,ticket.sapApp,ticket.sapError);
      bindSapFields(form);
    }
    sap.hidden = service.value !== "ERP";
    for (const control of sap.querySelectorAll("input,select")) control.disabled = sap.hidden;
  };
  area.onchange = () => {
    service.innerHTML = options(["Noch nicht bekannt", ...areaServices[area.value]], service.value);
    showSapFields();
  };
  service.onchange = showSapFields;
  bindSapFields(form);
  const editor = bindDescriptionEditor(ticket);
  const attachments = bindAttachments(ticket.attachments, {keepExisting:true});
  bindEvidence($("dialog"), attachments.addFile, () => panel.open);
  form.onsubmit = async event => {
    event.preventDefault();
    const fields = Object.fromEntries([...new FormData(form)].map(([name, value]) => [name, name === "description" ? value : value.trim()]));
    if (!fields.title || !fields.description.trim() || fields.description.length > 3000) {
      error.textContent = t("Bitte Betreff und eine Beschreibung mit bis zu 3.000 Zeichen eingeben.");
      return;
    }
    if (ticket.requester !== $("actor").value) return;
    const descriptionFormat = editor.getFormat();
    const files = attachments();
    if (fields.service !== "ERP") {
      for (const name of ["sapProcess","sapStep","sapContext","sapApp","sapError"]) {
        if (ticket[name]) fields[name] = "";
      }
    }
    const changed = Object.keys(fields).filter(name => fields[name] !==
      (ticket[name] ?? (name === "area" ? "IT" : name === "service" ? "Noch nicht bekannt" : ""))); 
    if (JSON.stringify(descriptionFormat) !== JSON.stringify(ticket.descriptionFormat ?? []) && !changed.includes("description")) changed.push("description");
    const added = files.filter(file => !(ticket.attachments ?? []).includes(file));
    if (!changed.length && !added.length) {
      panel.open = false;
      return;
    }
    const labels = {title:"Betreff", description:"Beschreibung", sourceLanguage:"Sprache des Originals",
      urgency:"Dringlichkeit (Einschätzung)", system:"System oder Gerät", area:"Servicebereich", service:"Betroffener Service", type:"Anliegenstyp",
      sapProcess:"SAP-Geschäftsprozess", sapStep:"Prozessschritt", sapContext:"Organisation und Belegreferenz", sapApp:"Fiori-App oder Transaktion", sapError:"Fehlermeldung", ...businessContextLabels};
    const history = [...ticket.history];
    if (changed.length) history.push(systemEvent("Anliegen aktualisiert: {fields}", {
      fields:changed.map(name => t(labels[name])).join(", "), author:ticket.requester
    }));
    for (const file of added) history.push(systemEvent("Anhang hinzugefügt: {file}", {file:file.name, author:ticket.requester}));
    const businessContextLanguages = {...ticket.businessContextLanguages};
    for (const name of Object.keys(businessContextLabels)) {
      if (changed.includes(name)) businessContextLanguages[name] = fields.sourceLanguage;
    }
    const catalogueChanged = ["area","service","type"].some(name => changed.includes(name));
    const updated = {...ticket, ...fields, catalogItem:catalogueChanged ? "" : ticket.catalogItem,
      sapComponent:fields.service === "ERP" ? ticket.sapComponent : "", descriptionFormat, attachments:files, businessContextLanguages, history,
      requesterEditedAt:new Date().toISOString()};
    await submit(form, tickets.map(item => item.number === ticket.number ? updated : item),
      t("{ticket} wurde aktualisiert.", {ticket:number(ticket)}));
  };
}

function openPortalTicket(ticket) {
  if (ticket.requester !== $("actor").value) return;
  const conversation = ticket.history.filter(entry =>
    entry.key === "{kind}: {note}" && ["Rückfrage","Antwort"].includes(entry.values?.kind));
  const attachments = (ticket.attachments ?? []).map((file, index) =>
    '<li><button type="button" data-download="' + index + '">' + uiText("Herunterladen") + esc(" · " + file.name) + '</button></li>').join("");
  show(number(ticket), ticket.title,
    '<p class="pill">' + uiText(ticket.status) + '</p>' + (ticket.system ? '<p>' + uiText("System oder Gerät") + esc(": " + ticket.system) + '</p>' : '') + '<p id="ticket-description" class="rich-text"></p>' +
    '<dl class="ticket-facts"><div><dt>' + uiText("Betroffener Service") + '</dt><dd>' + uiText(ticket.service || "Noch nicht bekannt") +
    '</dd></div><div><dt>' + uiText("Anliegenstyp") + '</dt><dd>' + uiText(ticket.type) +
    '</dd></div><div><dt>' + uiText("Gemeldete Dringlichkeit") + '</dt><dd>' + uiText(ticket.urgency || "Noch nicht bekannt") +
    '</dd></div><div><dt>' + uiText("Gemeldete Kritikalität") + '</dt><dd>' + uiText(ticket.reportedCriticality || "Noch nicht bewertet") + '</dd></div></dl>' + businessContextDisplay(ticket) + portalEditMarkup(ticket) + actionDisplay(ticket, true) + outageUpdates(ticket) + translationPanel(ticket) + (attachments ? '<h3>' + uiText("Anhänge") + '</h3><ul id="portal-attachments">' + attachments + '</ul>' : '') +
    '<section class="history"><h3>' + uiText("Kommunikation") + '</h3><ul>' +
    conversation.map(entry => '<li><small class="muted">' + esc(date(entry.at)) + '</small> · ' +
      uiText(entry.values.kind) + esc(" · " + (entry.values.author ? entry.values.author + ": " : "")) + readingText(entry.values.note,entry.values.language) + '</li>').join("") +
    '</ul></section><form id="edit">' +
    select("Sprache deiner neuen Nachricht", "noteLanguage", Object.keys(languages), getLanguage(), code => languages[code]) +
    '<label>' + uiText("Antwort") +
    '<textarea name="note" rows="3" maxlength="1200" required></textarea></label>' + formEnd("Antwort senden"));
  appendRichText($("ticket-description"), ticket.description, ticket.descriptionFormat);
  bindTranslation(ticket, switchLanguage);
  bindPortalEditor(ticket);
  const editButton = $("edit-ticket");
  editButton.dataset.uiKey = "Bearbeiten und Anhänge";
  editButton.textContent = t("Bearbeiten und Anhänge");
  editButton.hidden = false;
  editButton.onclick = () => {
    const panel = $("portal-editor");
    panel.open = true;
    panel.scrollIntoView({block:"start"});
    $("portal-edit").elements.namedItem("title").focus({preventScroll:true});
  };
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
  if (values.note) return uiText(values.kind || "Begründung bei Prioritätswechsel") + ": " + readingText(values.note,values.language);
  if (values.reason) return uiText(values.status) + esc(" · " + values.person + ": ") + readingText(values.reason,values.language);
  if (!entry.key) return readingText(entry.text);
  return uiText(entry.key, values, entry.localized);
}

function agentTools(ticket) {
  const affected = tickets.filter(item => item.relatedOutage === ticket.number);
  const teams = [...new Set(affected.map(item => item.department).filter(Boolean))];
  const group = (label, content) => '<fieldset class="wide feature-group"><legend>' + uiText(label) + '</legend><div class="grid">' + content + '</div></fieldset>';
  return group("Servicefristen und Wissen",
    '<ul class="wide">' + serviceDeadlines(ticket).map(item => '<li><strong>' + uiText(item.label) + '</strong> · ' +
      esc(date(item.due)) + ' · ' + uiText(item.status) + '</li>').join("") + '</ul>' +
    '<p class="wide muted">' + uiText("Demo-Fristen laufen rund um die Uhr. Eine Fristwarnung priorisiert das Ticket in der Warteschlange.") + '</p>' +
    (ticket.escalation ? '<p class="wide"><strong>' + uiText("Eskalation") + '</strong> · ' +
      esc(ticket.escalation.by) + ' · ' + readingText(ticket.escalation.note,ticket.escalation.language) + '</p>' : '') +
    field("Eskalationshinweis", "escalationNote", "", "maxlength=500") +
    (ticket.system ? '<p class="wide">' + uiText("{count} offene Tickets für {system}", {
      count:tickets.filter(item => item.system === ticket.system && (item.area || "IT") === (ticket.area || "IT") && item.status !== statuses[3]).length,
      system:ticket.system
    }) + '</p>' : '') +
    select("Wissensartikel", "articleMode", ["","publish","remove"], "", value =>
      t({publish:"Hilfeartikel veröffentlichen",remove:"Hilfeartikel zurückziehen"}[value] ?? "Keine Änderung")) +
    field("Artikeltitel", "articleTitle", ticket.article?.title, "maxlength=120") +
    '<label class="wide">' + uiText("Öffentlicher Lösungsweg") + '<textarea name="articleBody" rows="3" maxlength="3000">' + esc(ticket.article?.body) + '</textarea></label>') +
    group("Test und Abnahme",
    field("Bitte um einen Funktionstest", "actionRequest", "", "maxlength=500") +
    select("Kanban-Aktion", "deliveryMode", ["","prepare","accept"], "", value =>
      t({prepare:"Übergabe vorbereiten",accept:"Abnahme anfordern"}[value] ?? "Keine Änderung")) +
    field("Ziel der Umsetzung", "deliveryGoal", ticket.delivery?.goal, "maxlength=500") +
    field("Projekt", "deliveryProject", ticket.delivery?.project, "maxlength=100") +
    field("Zielspalte", "deliveryColumn", ticket.delivery?.column, "maxlength=100") +
    '<label class="wide">' + uiText("Abnahmekriterien") + '<textarea name="deliveryCriteria" maxlength="1200" rows="2">' + esc(ticket.delivery?.criteria) + '</textarea></label>' +
    (ticket.delivery ? '<div class="wide kanban-actions"><button type="button" id="preview-delivery">' + uiText("Kanban-Entwurf prüfen") +
      '</button><a href="http://127.0.0.1:8090/" target="_blank" rel="noopener noreferrer">' + uiText("Kanban-Board öffnen") + '</a></div>' +
      '<div class="wide" id="delivery-preview" hidden><pre id="delivery-text"></pre><button type="button" id="copy-delivery">' + uiText("Entwurf kopieren") +
      '</button><p id="delivery-copy-status" role="status"></p></div>' : '')) +
    group("Sammelstörung",
      select("Sammelstörungsaktion", "outageMode", ["","publish","resolve"], "", value =>
        t({publish:"Als Sammelstörung veröffentlichen",resolve:"Sammelstörung beenden"}[value] ?? "Keine Änderung")) +
      field("Öffentlicher Störungstitel", "outageTitle", ticket.outage?.title, "maxlength=120") +
      '<label class="wide">' + uiText("Statusmeldung für Betroffene") + '<textarea name="outageUpdate" rows="2" maxlength="1200"></textarea></label>' +
      (ticket.outage ? '<p class="wide">' + uiText(ticket.outage.active ? "Sammelstörung aktiv" : "Sammelstörung beendet") + ' · ' +
        uiText("{count} betroffene Personen", {count:new Set(affected.map(item => item.requester)).size}) + ' ' + teams.map(team => uiText(team)).join(", ") + '</p>' +
        (affected.length ? '<ul class="wide">' + affected.map(item => '<li><button type="button" data-affected="' + item.number + '">' +
          esc(number(item) + " · " + item.requester + " · " + item.title) + '</button></li>').join("") + '</ul>' : '') : '')) +
    group("Diagnose und Schichtübergabe",
      '<div class="wide kanban-actions"><button type="button" id="diagnosis-draft">' + uiText("Diagnoseentwurf anzeigen") +
      '</button><button type="button" id="shift-brief">' + uiText("Schichtübergabe anzeigen") + '</button></div>' +
      '<section id="agent-draft" class="wide intake-context" aria-live="polite" hidden></section>');
}

function bindAgentTools(ticket) {
  const draft = $("agent-draft");
  const renderText = (label, text) => '<p class="rich-label">' + uiText(label) + '</p><p class="rich-text">' + esc(text) + '</p>';
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
      entry.values?.note || entry.values?.reason || entry.key === "Testergebnis: {result}").reverse();
    draft.hidden = false;
    const section = (label, selected) => '<p class="rich-label">' + uiText(label) + '</p>' +
      (selected.length ? '<ul>' + selected.map(({entry,index}) =>
        '<li><button type="button" data-source="' + index + '">' + esc(date(entry.at)) + '</button> ' +
        esc(entry.values.note ?? entry.values.reason ?? t(entry.values.result)) + '</li>').join("") + '</ul>' : '<p>–</p>');
    draft.innerHTML = renderText("Gemeldete Fakten",ticket.description) +
      renderText("Zuständige Person",ticket.owner || "–") +
      renderText("Nächster Schritt", nextAction(ticket)?.prompt || t(intake[ticket.type]?.next ?? intake[types[0]].next)) +
      section("Bereits versucht",entries.filter(({entry}) => entry.values.kind === "Bereits versucht")) +
      section("Zusagen",entries.filter(({entry}) => entry.values.kind === "Zusage")) +
      section("Belegte Rückmeldungen und Entscheidungen",entries.filter(({entry}) =>
        !["Bereits versucht","Zusage"].includes(entry.values.kind)));
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
    '<p class="muted">' + esc(ticket.requester) + (ticket.department ? ' · ' + uiText(ticket.department) : '') + ' · ' + uiText(ticket.area || "IT") + " · " + uiText(ticket.service || "IT") + (ticket.urgency ? " · " + uiText("Gemeldete Dringlichkeit") + ": " + uiText(ticket.urgency) : "") + '</p><p id="ticket-description" class="rich-text">' +
    '</p><p><strong>' + uiText("Gemeldete Kritikalität") + '</strong> · ' + uiText(ticket.reportedCriticality || "Noch nicht bewertet") + '</p>' + businessContextDisplay(ticket) + actionDisplay(ticket, false) + translationPanel(ticket) + '<section class="intake-context" aria-label="' + esc(t("Erstbewertung")) + '"><p class="rich-label">' + uiText("Nächster Schritt") + '</p><p>' +
    uiText(ticket.status === statuses[3] ? "Vorgang abgeschlossen." : intake[ticket.type]?.next ?? intake[types[0]].next) + '</p>' +
    (ticket.rationale ? '<p><strong>' + uiText("Projektbegründung") + '</strong> · ' + readingText(ticket.rationale,ticket.rationaleLanguage) + '</p>' : '') +
    (ticket.delivery ? '<p><strong>' + uiText("Ziel der Umsetzung") + '</strong> · ' + readingText(ticket.delivery.goal,ticket.delivery.language) +
      '</p><p><strong>' + uiText("Abnahmekriterien") + '</strong> · ' + readingText(ticket.delivery.criteria,ticket.delivery.language) + '</p>' : '') +
    (ticket.sapStep ? '<p><strong>' + uiText("Prozessschritt") + '</strong> · ' + uiText(ticket.sapStep) + '</p>' : '') +
    (ticket.sapProcess ? '<p><strong>' + uiText("SAP-Geschäftsprozess") + '</strong> · ' + uiText(ticket.sapProcess) + '</p>' : '') +
    (ticket.catalogItem ? '<p><strong>' + uiText("Servicekatalog") + '</strong> · ' + uiText(ticket.catalogItem) + '</p>' : '') +
    Object.entries(ticket.intakeAnswers ?? {}).map(([name,value]) =>
      '<p><strong>' + uiText(intakeLabels[name] ?? name) + '</strong> · ' + esc(name === "needed" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Intl.DateTimeFormat(getLanguage(), {dateStyle:"medium", timeZone:"UTC"}).format(new Date(value)) : t(value)) + '</p>'
    ).join("") + '</section><form id="edit"><div class="grid">' +
    select("Anliegenstyp", "type", types, ticket.type) +
    (ticket.type === "Problem" ? '<label class="wide">' + uiText("Ursachenanalyse") +
      '<textarea name="rootCause" rows="3" maxlength="3000">' + esc(ticket.rootCause) + '</textarea></label>' : '') + select("Bearbeitungsstatus", "status", statuses, ticket.status) +
    select("Priorität", "priority", priorities, ticket.priority) + field("Begründung bei Prioritätswechsel", "priorityReason", "", "maxlength=500") +
    (ticket.service === "ERP" ? '<fieldset class="wide feature-group"><legend>' + uiText("SAP S/4HANA") +
      '</legend>' + sapFields(ticket.sapProcess, ticket.sapStep, ticket.sapContext, ticket.sapApp, ticket.sapError) +
      select("SAP-Komponente", "sapComponent", ["", ...sapComponents], ticket.sapComponent, value => t(value || "Noch nicht bekannt")) + '</fieldset>' : "") +
    field("System oder Gerät", "system", ticket.system, "maxlength=120") + select("Zuständige Person", "owner", [...new Set(["", ...agents, ticket.owner || ""])], ticket.owner || "",
      value => value || t("Nicht zugewiesen")) +
    (suggested ? '<div class="wide intake-context"><p>' +
      uiText("Prioritätsvorschlag aus Auswirkung und Dringlichkeit: {priority}", {priority:suggested}, ["priority"]) +
      '</p><button type="button" id="apply-priority">' + uiText("Vorschlag übernehmen") + '</button></div>' : '') +
    select("Projektentscheidung", "decision", decisions, ticket.decision) + field("Projektreferenz", "reference", ticket.reference, "maxlength=100") +
    field("Link zur Kanban-Karte", "kanbanUrl", ticket.kanbanUrl, "type=url maxlength=300") +
    '<div class="wide kanban-actions">' +
    (kanbanLink(ticket.kanbanUrl) ? '<a href="' + esc(kanbanLink(ticket.kanbanUrl)) + '" target="_blank" rel="noopener noreferrer">' + uiText("Kanban-Karte öffnen") + '</a>' : '') +
    '<button type="button" id="copy-handoff">' + uiText("Übergabe kopieren") + '</button><span id="handoff-status" role="status"></span></div>' +
    '<label class="wide">' + uiText("Begründung der Projektentscheidung") + '<textarea name="rationale" rows="2" maxlength="1200">' +
    esc(ticket.rationale) + '</textarea></label>' +
    '<fieldset class="wide feature-group"><legend>' + uiText("Kommunikation") + '</legend><div class="grid">' +
    select("Art der Rückmeldung", "noteKind", ["Rückfrage", "Antwort", "Interne Notiz", "Bereits versucht", "Zusage"], "Interne Notiz") +
    select("Sprache deiner neuen Nachricht", "noteLanguage", Object.keys(languages), getLanguage(), code => languages[code]) +
    '<label class="wide">' + uiText("Nachricht") + '<textarea name="note" rows="2" maxlength="1200"></textarea></label></div></fieldset>' +
    '<fieldset class="wide feature-group"><legend>' + uiText("Freigabe") + '</legend><div class="grid">' +
    '<p class="wide">' + uiText(ticket.approval?.status || "Keine Freigabe erfasst") +
    (ticket.approval?.person ? ' · ' + esc(ticket.approval.person) : '') + '</p>' +
    select("Freigabeaktion", "approvalAction", ["", ...approvalDecisions], "", value => t(value || "Keine Änderung")) +
    field("Freigebende Person", "approver", ticket.approval?.person, "maxlength=100") +
    '<label class="wide">' + uiText("Begründung der Freigabe") + '<textarea name="approvalReason" rows="2" maxlength="1200"></textarea></label></div></fieldset>' +
    '<fieldset class="wide feature-group"><legend>' + uiText("Ticketbeziehungen") + '</legend>' +
    '<ul id="ticket-relations">' + relationList(ticket) + '</ul><div class="grid">' +
    select("Beziehungstyp", "relationKind", relationKinds, relationKinds[0]) +
    select("Verknüpftes Ticket", "relationTarget", ["", ...tickets.filter(other => other.number !== ticket.number).map(other => String(other.number))],
      "", value => { const other = tickets.find(item => String(item.number) === value); return other ? number(other) + " · " + other.title : t("Ticket auswählen"); }) +
    '</div></fieldset>' + agentTools(ticket) + attachmentsForm() + '</div>' +
    formEnd() + '<section class="history"><h3>' + uiText("Verlauf") + '</h3><ul>' + ticket.history.slice().reverse().map(entry =>
      '<li id="history-entry-' + ticket.history.indexOf(entry) + '"><small class="muted">' + date(entry.at) + '</small> · ' + (entry.values?.author ? esc(entry.values.author) + " · " : "") + historyEntryText(entry) + '</li>').join("") + '</ul></section>');
  appendRichText($("ticket-description"), ticket.description, ticket.descriptionFormat);
  bindTranslation(ticket, switchLanguage);
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
  bindSapFields($("edit"));
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
      unlink.innerHTML = uiText(removedLinks.has(target) ? "Entfernen rückgängig" : "Beziehung entfernen");
    }
  };
  $("edit").onsubmit = async (e) => {
    e.preventDefault();
    const {note, noteKind, noteLanguage, approvalAction, approver, approvalReason, relationKind, relationTarget, actionRequest, outageMode, outageTitle, outageUpdate, deliveryMode, deliveryGoal, deliveryCriteria, deliveryProject, deliveryColumn, priorityReason, articleMode, articleTitle, articleBody, escalationNote, ...fields} = Object.fromEntries([...new FormData(e.target)].map(([name, value]) => [name, value.trim()]));
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
    if (fields.priority !== ticket.priority && !priorityReason && fields.priority !== suggested) {
      $("error").textContent = t("Bitte begründe die manuelle Prioritätsänderung.");
      return;
    }
    if (articleMode === "publish" && (fields.status !== statuses[3] || !articleTitle || !articleBody)) {
      $("error").textContent = t("Zum Veröffentlichen muss das Ticket abgeschlossen sein. Titel und Lösungsweg sind Pflicht.");
      return;
    }
    const labels = {sapStep:"Prozessschritt",sapContext:"Organisation und Belegreferenz",sapApp:"Fiori-App oder Transaktion",sapError:"Fehlermeldung",sapComponent:"SAP-Komponente",sapProcess:"SAP-Geschäftsprozess",rootCause:"Ursachenanalyse",system:"System oder Gerät",type:"Anliegenstyp", status:"Status", priority:"Priorität", owner:"Zuständigkeit", decision:"Projektentscheidung", reference:"Projektreferenz", rationale:"Projektbegründung", kanbanUrl:"Link zur Kanban-Karte"};
    const history = Object.keys(fields).filter(name => fields[name] !== (ticket[name] ?? "")).map(name =>
      systemEvent("{field} geändert: {before} → {after}", {field:labels[name], before:ticket[name] || "–", after:fields[name] || "–"},
        ["type","status","priority","decision","sapProcess","sapStep"].includes(name) ? ["field","before","after"] : ["field"]));
    if (fields.priority !== ticket.priority && priorityReason) history.push(systemEvent("Prioritätsbegründung: {note}", {note:priorityReason, language:getLanguage()}));
    if (articleMode) history.push(systemEvent(articleMode === "publish" ? "Hilfeartikel veröffentlicht" : "Hilfeartikel zurückgezogen"));
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
      if ((relationKind === "Ursache untersucht in" && (fields.type !== "Störung" || target.type !== "Problem")) ||
        (relationKind === "Dauerhafte Korrektur" && (fields.type !== "Problem" || target.type !== "Änderungsantrag"))) {
        $("error").textContent = t("Verknüpfe eine Störung mit einem Problem und ein Problem mit einem Änderungsantrag.");
        return;
      }
      relations.push({target:target.number, kind:relationKind});
      history.push(systemEvent("{kind}: {ticket}", {kind:relationKind,ticket:number(target)}, ["kind"]));
    }
    const at = new Date().toISOString();
    const actor = $("actor").value;
    const escalation = escalationNote ? {note:escalationNote,by:actor,at,language:getLanguage()} : ticket.escalation;
    if (escalationNote) history.push(systemEvent("Eskalation erfasst"));
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
    const article = articleMode === "publish" ? {title:articleTitle,body:articleBody,service:ticket.service,language:getLanguage()} :
      articleMode === "remove" ? null : ticket.article;
    const respondedAt = ticket.respondedAt || (note && ["Rückfrage","Antwort"].includes(noteKind) || actionRequest || deliveryMode === "accept" ? at : null);
    const resolvedAt = fields.status === statuses[3] ? ticket.resolvedAt || at : null;
    const updated = {...ticket, ...fields, article, escalation, respondedAt, resolvedAt, rationaleLanguage: fields.rationale === ticket.rationale ? ticket.rationaleLanguage : getLanguage(), attachments: files, approval, relations, nextAction:action, outage, delivery, history: [...ticket.history, ...history]};
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
  if (e.target.closest("[data-open-it]")) {
    $("workspace").value = "it";
    $("view").value = views[0];
    $("area-filter").selectedIndex = $("type").selectedIndex = $("status").selectedIndex = 0;
    $("search").value = "";
    activeMetric = "";
    render();
    $("workspace").focus();
    return;
  }
  const row = e.target.closest("[data-number]");
  if (row) openTicket(tickets.find(t => t.number === Number(row.dataset.number)));
};
$("search").oninput = render;
$("type").onchange = render;
$("status").onchange = render;
$("view").onchange = render;
$("area-filter").onchange = render;
$("requester-filter").onchange = render;
$("workspace").onchange = () => { activeMetric = ""; render(); };
$("actor").onchange = render;
markStaticUI($("rich-toolbar-template").content);
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











