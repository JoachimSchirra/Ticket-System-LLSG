import { getLanguage, languages, t } from "./i18n.mjs";

const escape = (value) => String(value).replace(/[&<>"']/g, c => ({
  "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
})[c]);
const hasLanguage = (code) => Object.hasOwn(languages, code);

function languageOptions(current, placeholder = "") {
  return (placeholder ? '<option value="">' + escape(t(placeholder)) + '</option>' : "") +
    Object.entries(languages).map(([code, label]) =>
      '<option value="' + code + '"' + (code === current ? " selected" : "") + ">" + label + "</option>"
    ).join("");
}

export function translationPanel(ticket) {
  const source = hasLanguage(ticket.sourceLanguage) ? ticket.sourceLanguage : "";
  return '<section class="translation-panel" aria-label="' + escape(t("KI-Übersetzung")) + '"><div class="translation-controls">' +
    (source ? '<p><strong>' + escape(t("Sprache des Originals")) + '</strong> · ' + languages[source] + '</p>' :
      '<label>' + escape(t("Sprache des Originals")) + '<select id="translation-source">' +
      languageOptions("", "Originalsprache unbekannt") + '</select></label>') +
    '<label>' + escape(t("Zielsprache")) + '<select id="translation-target">' +
    languageOptions(source === getLanguage() ? (source === "en" ? "de" : "en") : getLanguage()) +
    '</select></label><button type="button" id="translate">' + escape(t("Mit KI übersetzen")) +
    '</button></div><p id="translation-status" role="status"></p><div id="translation-result" hidden>' +
    '<h3 id="translation-heading"></h3><strong id="translated-subject"></strong><p id="translated-description" class="rich-text"></p></div></section>';
}

export function bindTranslation(ticket) {
  const $ = id => document.getElementById(id);
  const button = $("translate"), sourcePicker = $("translation-source"), targetPicker = $("translation-target");
  const status = $("translation-status"), result = $("translation-result");
  const source = () => sourcePicker?.value ?? ticket.sourceLanguage;
  const browserTranslator = globalThis.Translator;
  const unsupported = "Dieser Browser stellt die lokale KI-Übersetzung nicht bereit. Öffne das Ticket in einer unterstützten Desktop-Version von Chrome oder Edge.";
  function refresh() {
    for (const option of targetPicker.options) option.disabled = option.value === source();
    if (targetPicker.value === source()) {
      targetPicker.value = Object.keys(languages).find(code => code !== source());
    }
    button.disabled = !browserTranslator || !hasLanguage(source());
    result.hidden = true;
    status.textContent = browserTranslator ? "" : t(unsupported);
  }
  if (sourcePicker) sourcePicker.onchange = refresh;
  targetPicker.onchange = refresh;
  refresh();
  button.onclick = async () => {
    if (button.disabled) return;
    const target = targetPicker.value;
    const pair = {sourceLanguage:source(), targetLanguage:target};
    button.disabled = targetPicker.disabled = true;
    if (sourcePicker) sourcePicker.disabled = true;
    result.hidden = true;
    status.textContent = t("Übersetzung wird erstellt …");
    let translator;
    try {
      if (await browserTranslator.availability(pair) === "unavailable") {
        status.textContent = t("Dieses Sprachpaar ist im Browser nicht verfügbar.");
        return;
      }
      translator = await browserTranslator.create(pair);
      const subject = await translator.translate(ticket.title);
      const description = await translator.translate(ticket.description);
      result.querySelector("#translation-heading").textContent = t("KI-Übersetzung") + " · " + languages[target];
      result.querySelector("#translated-subject").textContent = subject;
      result.querySelector("#translated-description").textContent = description;
      result.lang = target;
      result.hidden = false;
      status.textContent = "";
    } catch {
      status.textContent = t("Die Übersetzung konnte nicht erstellt werden. Bitte versuche es erneut.");
    } finally {
      translator?.destroy();
      button.disabled = targetPicker.disabled = false;
      if (sourcePicker) sourcePicker.disabled = false;
    }
  };
}
