import { getLanguage, languages, t } from "./i18n.mjs";

const escape = value => String(value ?? "").replace(/[&<>"']/g, c =>
  ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
const hasLanguage = code => Object.hasOwn(languages, code);
const cached = new Map();
const cacheKey = (text, source, target) => JSON.stringify([text, source, target]);
export const translatedTitle = ticket => cached.get(cacheKey(ticket.title,ticket.sourceLanguage,getLanguage())) ?? ticket.title;

export function readingText(value, source = "") {
  return '<span data-reading-text data-reading-language="' + escape(hasLanguage(source) ? source : "") + '">' + escape(value) + '</span>';
}

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
    '<label>' + escape(t("Lesesprache des Tickets")) + '<select id="translation-target">' +
    languageOptions(getLanguage()) +
    '</select></label><button type="button" id="translate">' + escape(t("Mit KI übersetzen")) +
    '</button><button type="button" id="translate-deepl">' + escape(t("Mit DeepL übersetzen")) + '</button></div><p id="translation-status" role="status"></p><div id="translation-result" hidden>' +
    '<button type="button" id="translation-original">' + escape(t("Original anzeigen")) + '</button></div></section>';
}

export function bindTranslation(ticket) {
  const $ = id => document.getElementById(id);
  const dialog = $("dialog"), title = $("dialog-title"), description = $("ticket-description");
  const button = $("translate"), sourcePicker = $("translation-source"), targetPicker = $("translation-target");
  const status = $("translation-status"), result = $("translation-result"), deepLButton = $("translate-deepl");
  const content = $("content");
  const source = () => sourcePicker?.value ?? ticket.sourceLanguage;
  const originals = [
    {node:title,text:ticket.title}, {node:description,text:ticket.description},
    ...[...content.querySelectorAll("[data-reading-text]")].map(node => ({
      node,text:node.textContent,language:node.dataset.readingLanguage
    }))
  ].map(item => ({...item,nodes:[...item.node.childNodes].map(node => node.cloneNode(true))}));
  let currentRun, readingOriginal = false, displayed;
  function restore() {
    for (const item of originals) {
      item.node.replaceChildren(...item.nodes.map(node => node.cloneNode(true)));
      item.node.lang = item.language || source() || "";
    }
  }
  function showReading(items, target) {
    restore();
    items.forEach(({item,value}) => {
      item.node.textContent = value;
      item.node.lang = target;
    });
  }
  function setBusy(busy) {
    button.disabled = busy || !globalThis.Translator || !hasLanguage(source());
    if (deepLButton) deepLButton.disabled = busy || !hasLanguage(source());
    targetPicker.disabled = busy;
    if (sourcePicker) sourcePicker.disabled = busy;
  }
  function clearReading() {
    displayed = null;
    readingOriginal = false;
    result.hidden = true;
    restore();
    status.textContent = "";
    setBusy(false);
  }
  async function translate(provider = "browser") {
    currentRun?.abort();
    clearReading();
    const target = targetPicker.value;
    const base = source();
    if (!hasLanguage(base)) return;
    const requested = originals.map(item => ({item,language:item.language || base}))
      .filter(({item,language}) => item.text.trim() && language !== target);
    if (!requested.length) return;
    if (provider === "browser" && !globalThis.Translator) {
      status.textContent = t("Dieser Browser stellt die lokale KI-Übersetzung nicht bereit. Öffne das Ticket in einer unterstützten Desktop-Version von Chrome oder Edge.");
      return;
    }
    const controller = new AbortController();
    currentRun = controller;
    const timeout = setTimeout(() => controller.abort(),90000);
    const translators = new Map();
    const translated = [];
    setBusy(true);
    status.textContent = t("Übersetzung wird erstellt …");
    try {
      for (const {item,language} of requested) {
        const context = language === base ? ticket.description : "";
        const key = provider === "deepl" ? JSON.stringify([provider,item.text,language,target,context]) : cacheKey(item.text,language,target);
        let value = cached.get(key);
        if (value === undefined && provider === "deepl") {
          const response = await fetch("/api/translate/deepl", {
            method:"POST", headers:{"Content-Type":"application/json"},
            body:JSON.stringify({text:item.text,source:language,target,context}), signal:controller.signal
          });
          if (response.status === 503 || response.status === 404) throw Error("DeepL ist auf diesem Rechner noch nicht eingerichtet.");
          if (!response.ok) throw Error("DeepL konnte den Text nicht übersetzen.");
          value = (await response.json()).text;
          if (cached.size >= 500) cached.delete(cached.keys().next().value);
          cached.set(key,value);
        }
        if (value === undefined) {
          let translator = translators.get(language);
          if (!translator) {
            const pair = {sourceLanguage:language,targetLanguage:target};
            if (await globalThis.Translator.availability(pair) === "unavailable") {
              throw new Error("Dieses Sprachpaar ist im Browser nicht verfügbar.");
            }
            translator = await globalThis.Translator.create({...pair,signal:controller.signal,monitor(monitor) {
              monitor.addEventListener("downloadprogress",event => {
                if (currentRun === controller && !controller.signal.aborted) status.textContent =
                  t("Sprachmodell wird geladen: {percent} %", {percent:Math.round(event.loaded * 100)});
              });
            }});
            translators.set(language,translator);
          }
          status.textContent = t("Übersetzung wird erstellt …");
          value = await translator.translate(item.text,{signal:controller.signal});
          if (cached.size >= 500) cached.delete(cached.keys().next().value);
          cached.set(key,value);
        }
        translated.push({item,value});
      }
      if (controller.signal.aborted || currentRun !== controller) return;
      showReading(translated,target);
      displayed = {translated,target};
      result.hidden = false;
      $("translation-original").textContent = t("Original anzeigen");
      status.textContent = (provider === "deepl" ? "DeepL" : t("KI-Übersetzung")) + " · " + languages[target];
    } catch (error) {
      if (currentRun === controller && dialog.open) status.textContent = t(
        ["Dieses Sprachpaar ist im Browser nicht verfügbar.","DeepL ist auf diesem Rechner noch nicht eingerichtet.","DeepL konnte den Text nicht übersetzen."].includes(error.message) ? error.message :
          "Die Übersetzung konnte nicht erstellt werden. Bitte versuche es erneut.");
    } finally {
      clearTimeout(timeout);
      for (const translator of translators.values()) translator.destroy();
      if (currentRun === controller && dialog.open) setBusy(false);
    }
  }
  $("translation-original").onclick = event => {
    if (!displayed) return;
    readingOriginal = !readingOriginal;
    if (readingOriginal) restore();
    else showReading(displayed.translated,displayed.target);
    event.target.textContent = t(readingOriginal ? "Übersetzung anzeigen" : "Original anzeigen");
  };
  dialog.addEventListener("close", () => { currentRun?.abort(); currentRun = null; }, {once:true});
  if (sourcePicker) sourcePicker.onchange = () => translate();
  targetPicker.onchange = () => translate();
  button.onclick = () => translate();
  if (deepLButton) deepLButton.onclick = () => translate("deepl");
  clearReading();
  return translate();
}
