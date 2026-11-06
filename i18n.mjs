const rows = `
Noch nicht eingeordnet|Unclassified|Da classificare
Störung|Incident|Incidente
Serviceanfrage|Service request|Richiesta di servizio
Servicekatalog|Service catalogue|Catalogo dei servizi
Vorlage auswählen (optional)|Choose a template (optional)|Scegli un modello (facoltativo)
ERP-Berechtigung|ERP access|Accesso ERP
Notebook bereitstellen|Request a laptop|Richiedi un portatile
VPN-Zugang|VPN access|Accesso VPN
Gemeinsames Postfach|Shared mailbox|Casella di posta condivisa
Nenne das ERP-System, die benötigte Rolle und den gewünschten Gültigkeitszeitraum.|Specify the ERP system, required role and desired validity period.|Indica il sistema ERP, il ruolo richiesto e il periodo di validità.
Nenne Einsatzort, Einsatzbeginn und besondere Anforderungen.|Specify the location, start date and any special requirements.|Indica sede, data di inizio ed eventuali requisiti particolari.
Nenne Gerät, Einsatzort und den benötigten Zeitraum.|Specify the device, location and required period.|Indica il dispositivo, la sede e il periodo richiesto.
Nenne den gewünschten Postfachnamen und die Personen, die Zugriff brauchen.|Specify the mailbox name and who needs access.|Indica il nome della casella e chi deve accedervi.
Kommunikation|Communication|Comunicazione
Art der Rückmeldung|Message type|Tipo di messaggio
Rückfrage|Follow-up question|Domanda di chiarimento
Antwort|Reply|Risposta
Interne Notiz|Internal note|Nota interna
Nachricht|Message|Messaggio
{kind}: {note}|{kind}: {note}|{kind}: {note}
Freigabe|Approval|Approvazione
Keine Freigabe erfasst|No approval recorded|Nessuna approvazione registrata
Keine Änderung|No change|Nessuna modifica
Freigabeaktion|Approval action|Azione di approvazione
Freigabe anfragen|Request approval|Richiedi approvazione
Genehmigen|Approve|Approva
Ablehnen|Reject|Rifiuta
Freigabe ausstehend|Approval pending|Approvazione in sospeso
Genehmigt|Approved|Approvato
Freigebende Person|Approver|Responsabile dell’approvazione
Begründung der Freigabe|Approval rationale|Motivazione dell’approvazione
Bitte Person und Begründung angeben. Für eine Entscheidung muss eine Freigabe offen sein.|Enter a person and a reason. A decision requires a pending approval.|Indica una persona e una motivazione. Per decidere occorre una richiesta in sospeso.
{status} · {person}: {reason}|{status} · {person}: {reason}|{status} · {person}: {reason}
Ticketbeziehungen|Ticket relationships|Relazioni tra ticket
Beziehungstyp|Relationship type|Tipo di relazione
Verknüpftes Ticket|Linked ticket|Ticket collegato
Ticket auswählen|Select a ticket|Seleziona un ticket
Verwandt|Related|Correlato
Duplikat von|Duplicate of|Duplicato di
Blockiert durch|Blocked by|Bloccato da
Wird behoben durch|Resolved by|Risolto da
Beziehung entfernen|Remove relationship|Rimuovi relazione
Entfernen rückgängig|Undo removal|Annulla rimozione
Beziehung entfernt: {ticket}|Relationship removed: {ticket}|Relazione rimossa: {ticket}
{kind}: {ticket}|{kind}: {ticket}|{kind}: {ticket}
Diese Ticketbeziehung ist bereits vorhanden oder ungültig.|This relationship already exists or is invalid.|Questa relazione esiste già o non è valida.
Zum verknüpften Ticket wechseln? Ungespeicherte Änderungen gehen verloren.|Open the linked ticket? Unsaved changes will be lost.|Aprire il ticket collegato? Le modifiche non salvate andranno perse.
Änderungsantrag|Change request|Richiesta di modifica
Neues Vorhaben|New initiative|Nuova iniziativa
Neu|New|Nuovo
In Bearbeitung|In progress|In lavorazione
Wartet auf Rückmeldung|Awaiting response|In attesa di risposta
Abgeschlossen|Closed|Chiuso
Niedrig|Low|Bassa
Normal|Normal|Normale
Hoch|High|Alta
Kritisch|Critical|Critica
Sofort|Immediate|Immediata
Nicht beantragt|Not requested|Non richiesta
In Prüfung|Under review|In valutazione
Abgelehnt|Rejected|Respinta
Als Projekt übernommen|Accepted as a project|Approvata come progetto
Arbeitsplatz & Hardware|Workplace & hardware|Postazione di lavoro e hardware
Zugänge & Berechtigungen|Access & permissions|Accessi e autorizzazioni
E-Mail & Zusammenarbeit|Email & collaboration|Email e collaborazione
Netzwerk & VPN|Network & VPN|Rete e VPN
Sonstiger IT-Service|Other IT service|Altro servizio IT
Vertrieb|Sales|Vendite
Wissenschaft / Forschung|Science / Research|Scienza / Ricerca
Geschäftsführung|Executive management|Direzione
Bereichsübergreifend|Cross-functional|Interfunzionale
Zuordnung offen|Unassigned|Assegnazione da definire
Andere Person|Other person|Altra persona
Alle Abteilungen|All departments|Tutti i reparti
Bitte auswählen|Select an option|Seleziona un’opzione
Ansicht|View|Vista
Alle Tickets|All tickets|Tutti i ticket
Handlungsbedarf|Needs attention|Richiede attenzione
Meine Anliegen|My requests|Le mie richieste
Person auswählen|Select a person|Seleziona una persona
Prioritätsvorschlag aus Auswirkung und Dringlichkeit: {priority}|Suggested priority based on impact and urgency: {priority}|Priorità suggerita in base a impatto e urgenza: {priority}
Vorschlag übernehmen|Apply suggestion|Applica suggerimento
Alle Typen|All types|Tutti i tipi
Alle Status|All statuses|Tutti gli stati
Offene Tickets|Open tickets|Ticket aperti
Neue Tickets|New tickets|Nuovi ticket
Hoch oder kritisch|High or critical|Alta o critica
Kachelfilter entfernen|Clear tile filter|Rimuovi filtro del riquadro
{label}: {shown} von {total} Tickets|{label}: {shown} of {total} tickets|{label}: {shown} di {total} ticket
In Projektprüfung|In project review|In valutazione come progetto
Keine Tickets für diese Auswahl.|No tickets match this selection.|Nessun ticket corrisponde alla selezione.
Abbrechen|Cancel|Annulla
Speichern|Save|Salva
TICKETANLAGE · IT|CREATE TICKET · IT|NUOVO TICKET · IT
Neues Anliegen|New ticket|Nuovo ticket
Betreff|Subject|Oggetto
Abteilung der anfragenden Person|Requester’s department|Reparto del richiedente
Anfragende Person|Requester|Richiedente
Name der anfragenden Person|Requester’s name|Nome del richiedente
Anliegenstyp|Request type|Tipo di richiesta
Betroffener Service|Affected service|Servizio interessato
Noch nicht bekannt|Not known yet|Non ancora noto
Dringlichkeit (Einschätzung)|Reported urgency|Urgenza segnalata
Gemeldete Dringlichkeit|Reported urgency|Urgenza segnalata
Beschreibung|Description|Descrizione
Beschreibung formatieren|Format description|Formatta la descrizione
Erstbewertung|Triage|Valutazione iniziale
Nächster Schritt|Next step|Prossimo passo
Vorgang abgeschlossen.|Ticket closed.|Ticket chiuso.
Bearbeitungsstatus|Status|Stato
Status|Status|Stato
Link zur Kanban-Karte|Kanban card link|Link alla scheda Kanban
Kanban-Karte öffnen|Open Kanban card|Apri scheda Kanban
Übergabe kopieren|Copy handoff|Copia passaggio di consegne
Ticketnummer, Betreff und Rücklink kopiert.|Ticket number, subject and backlink copied.|Numero, oggetto e link al ticket copiati.
Kopieren nicht möglich.|Unable to copy.|Impossibile copiare.
Bitte einen Kartenlink vom lokalen Kanban-Board einfügen.|Paste a card link from the local Kanban board.|Incolla il link di una scheda della bacheca Kanban locale.
Priorität|Priority|Priorità
Zuständige Person|Assignee|Assegnatario
Zuständigkeit|Assignment|Assegnazione
Projektentscheidung|Project decision|Decisione sul progetto
Projektreferenz|Project reference|Riferimento del progetto
Projektbegründung|Project rationale|Motivazione del progetto
Begründung der Projektentscheidung|Reason for the project decision|Motivazione della decisione sul progetto
Verlaufsnotiz|Activity note|Nota per la cronologia
Verlauf|Activity|Cronologia
Anhänge|Attachments|Allegati
Dateien aus dem Explorer hierher ziehen oder auswählen.|Drag files here from Explorer or select them.|Trascina qui i file da Esplora file oppure selezionali.
Anhänge auswählen|Select attachments|Seleziona allegati
Bis zu 10 MB pro Datei und 40 MB pro Ticket.|Up to 10 MB per file and 40 MB per ticket.|Fino a 10 MB per file e 40 MB per ticket.
Herunterladen|Download|Scarica
Entfernen|Remove|Rimuovi
{file} überschreitet das Größenlimit.|{file} exceeds the size limit.|{file} supera il limite di dimensione.
SAP Transformation Lab · Interner Service|SAP Transformation Lab · Internal Service|SAP Transformation Lab · Servizi interni
IT-SERVICEBEREICH|IT SERVICE DESK|SERVIZIO IT
Ticketübersicht|Ticket overview|Panoramica dei ticket
Anliegen aufnehmen, bewerten und weiterverfolgen.|Capture, assess and track requests.|Registra, valuta e segui le richieste.
＋ Neues Ticket|＋ New ticket|＋ Nuovo ticket
Kennzahlen|Metrics|Indicatori
Tickets durchsuchen|Search tickets|Cerca ticket
Ticketnummer oder Stichwort suchen|Search by ticket number or keyword|Cerca per numero di ticket o parola chiave
Tickettyp filtern|Filter by request type|Filtra per tipo di richiesta
Status filtern|Filter by status|Filtra per stato
Prototyp mit fiktiven LLSG-Daten. Tickets und Anhänge werden in diesem Browser gespeichert.|Prototype with fictional LLSG data. Tickets and attachments are stored in this browser.|Prototipo con dati LLSG fittizi. Ticket e allegati vengono salvati in questo browser.
Schließen|Close|Chiudi
Oberflächensprache|Interface language|Lingua dell’interfaccia
Beschreibe dein Anliegen in eigenen Worten. Die IT übernimmt die Einordnung.|Describe your request in your own words. IT will classify it.|Descrivi la richiesta con parole tue. Il team IT la classificherà.
Anliegen sichten und einem Bearbeitungsweg zuordnen.|Review and route the request.|Esamina e instrada la richiesta.
Beschreibe, was ausgefallen ist und wie stark die Arbeit betroffen ist.|Describe what stopped working and how much it affects your work.|Descrivi cosa ha smesso di funzionare e in che misura incide sul lavoro.
Wer ist betroffen?|Who is affected?|Chi è coinvolto?
Nur ich|Just me|Solo io
Ein Team|One team|Un team
Mehrere Teams|Several teams|Più team
Ganze Organisation|Entire organisation|Intera organizzazione
Gibt es einen Ausweichweg?|Is there a workaround?|Esiste una soluzione temporanea?
Ja|Yes|Sì
Nein|No|No
Auswirkung und Dringlichkeit prüfen und den Betrieb wiederherstellen.|Assess impact and urgency, then restore service.|Valuta impatto e urgenza, quindi ripristina il servizio.
Gib an, für wen und bis wann die Leistung gebraucht wird.|Say who needs the service and by when.|Indica chi ha bisogno del servizio e per quando.
Für wen ist die Anfrage?|Who is the request for?|Per chi è la richiesta?
Für mich|For me|Per me
Für eine andere Person|For someone else|Per un’altra persona
Für ein Team|For a team|Per un team
Benötigt bis|Needed by|Necessario entro
Standardleistung und erforderliche Freigabe prüfen.|Check the standard service and any required approval.|Verifica il servizio standard e l’eventuale approvazione richiesta.
Beschreibe den heutigen Zustand und das gewünschte Ergebnis.|Describe the current situation and the desired outcome.|Descrivi la situazione attuale e il risultato desiderato.
Welche Art von Änderung?|What kind of change?|Quale tipo di modifica?
Konfiguration|Configuration|Configurazione
Funktionserweiterung|Feature enhancement|Estensione funzionale
Schnittstelle|Integration|Interfaccia
Sonstiges|Other|Altro
Gewünschter Termin|Requested date|Data richiesta
Auswirkungen und Risiken bewerten und über Freigabe oder Projektprüfung entscheiden.|Assess impact and risk, then decide on approval or project review.|Valuta impatto e rischi, quindi decidi se approvare o avviare la valutazione del progetto.
Beschreibe das angestrebte Ergebnis und wer davon profitiert.|Describe the intended outcome and who benefits.|Descrivi il risultato atteso e chi ne beneficia.
Welche Abstimmung ist absehbar?|Who needs to coordinate?|Chi dovrà coordinarsi?
Externe Beteiligte|External participants|Soggetti esterni
Ziel, Nutzen und Zuständigkeit klären und bei Bedarf zur Projektprüfung geben.|Clarify the goal, benefits and ownership, then refer for project review if needed.|Chiarisci obiettivo, benefici e responsabilità, quindi avvia la valutazione del progetto se necessario.
Bitte Betreff, anfragende Person und eine Beschreibung mit bis zu 3.000 Zeichen eingeben.|Enter a subject, a requester and a description of up to 3,000 characters.|Inserisci oggetto, richiedente e una descrizione di massimo 3.000 caratteri.
Für die Projektübernahme ist eine Projektreferenz erforderlich.|A project reference is required to accept the ticket as a project.|Per approvare il ticket come progetto serve un riferimento al progetto.
Bitte die Projektentscheidung begründen.|Enter a reason for the project decision.|Indica il motivo della decisione sul progetto.
Der Datenstand wurde in einem anderen Tab geändert. Bitte lade die Seite neu und wiederhole die Änderung.|The data changed in another tab. Reload this page and try again.|I dati sono cambiati in un’altra scheda. Ricarica la pagina e riprova.
Die Änderung konnte nicht gespeichert werden. Bitte prüfe den verfügbaren Browserspeicher.|The change could not be saved. Check available browser storage.|Impossibile salvare la modifica. Controlla lo spazio disponibile nel browser.
Der Browserspeicher ist nicht verfügbar. Bitte öffne den Prototyp in einem normalen Browserfenster.|Browser storage is unavailable. Open the prototype in a regular browser window.|L’archiviazione del browser non è disponibile. Apri il prototipo in una finestra normale.
{ticket} wurde angelegt.|{ticket} was created.|{ticket} è stato creato.
{ticket} wurde aktualisiert.|{ticket} was updated.|{ticket} è stato aggiornato.
Ticket angelegt|Ticket created|Ticket creato
Fiktiver Pilotfall angelegt|Fictional demo ticket created|Ticket dimostrativo creato
{field} geändert: {before} → {after}|{field} changed: {before} → {after}|{field}: {before} → {after}
Anhang hinzugefügt: {file}|Attachment added: {file}|Allegato aggiunto: {file}
Anhang entfernt: {file}|Attachment removed: {file}|Allegato rimosso: {file}
Sprache des Originals|Original language|Lingua dell’originale
Originalsprache unbekannt|Original language unknown|Lingua originale sconosciuta
Zielsprache|Target language|Lingua di destinazione
Mit KI übersetzen|Translate with AI|Traduci con IA
Übersetzung wird erstellt …|Translating…|Traduzione in corso…
KI-Übersetzung|AI translation|Traduzione con IA
Dieser Browser stellt die lokale KI-Übersetzung nicht bereit. Öffne das Ticket in einer unterstützten Desktop-Version von Chrome oder Edge.|This browser does not provide on-device AI translation. Open the ticket in a supported desktop version of Chrome or Edge.|Questo browser non offre la traduzione IA locale. Apri il ticket in una versione desktop compatibile di Chrome o Edge.
Dieses Sprachpaar ist im Browser nicht verfügbar.|This language pair is unavailable in this browser.|Questa coppia di lingue non è disponibile nel browser.
Die Übersetzung konnte nicht erstellt werden. Bitte versuche es erneut.|Translation failed. Please try again.|Traduzione non riuscita. Riprova.
Fett|Bold|Grassetto
Kursiv|Italic|Corsivo
Unterstrichen|Underline|Sottolineato
Durchgestrichen|Strikethrough|Barrato
Schriftfarbe|Text colour|Colore del testo
Standard|Default|Predefinito
Rot|Red|Rosso
Grün|Green|Verde
Blau|Blue|Blu
Violett|Purple|Viola
Orange|Orange|Arancione
Gemischt|Mixed|Misto
Hervorhebung|Highlight|Evidenziazione
Keine Farbe|No colour|Nessun colore
Gelb|Yellow|Giallo
Rosa|Pink|Rosa
Schriftgröße|Font size|Dimensione del carattere
Klein · 14|Small · 14|Piccolo · 14
Normal · 16|Normal · 16|Normale · 16
Groß · 20|Large · 20|Grande · 20
Sehr groß · 24|Extra large · 24|Molto grande · 24
Aufzählung|Bulleted list|Elenco puntato
Nummerierte Liste|Numbered list|Elenco numerato
• Liste|• List|• Elenco
1. Liste|1. List|1. Elenco
Formatierung entfernen|Clear formatting|Rimuovi formattazione
Textänderung rückgängig|Undo text change|Annulla modifica del testo
Textänderung wiederholen|Redo text change|Ripristina modifica del testo
Fett (Strg+B)|Bold (Ctrl+B)|Grassetto (Ctrl+B)
Kursiv (Strg+I)|Italic (Ctrl+I)|Corsivo (Ctrl+I)
Unterstrichen (Strg+U)|Underline (Ctrl+U)|Sottolineato (Ctrl+U)
Aufzählung ein-/ausschalten|Toggle bulleted list|Attiva o disattiva elenco puntato
Nummerierung ein-/ausschalten|Toggle numbered list|Attiva o disattiva numerazione
Formatierung im markierten Text entfernen|Clear formatting in selected text|Rimuovi la formattazione dal testo selezionato
Im Text rückgängig (Strg+Z)|Undo (Ctrl+Z)|Annulla (Ctrl+Z)
Im Text wiederholen (Strg+Y)|Redo (Ctrl+Y)|Ripristina (Ctrl+Y)
`;
const dictionary = new Map(rows.trim().split("\n").map(row => {
  const [key, en, it] = row.split("|");
  return [key, {en, it}];
}));
export const languages = {de:"Deutsch", en:"English", it:"Italiano"};
const languageKey = "llsg.interface-language";
let language = "de";
try {
  const saved = localStorage.getItem(languageKey);
  if (Object.hasOwn(languages, saved)) language = saved;
} catch { /* Language switching remains available for this session. */ }

export const getLanguage = () => language;
export function setLanguage(value) {
  if (!Object.hasOwn(languages, value)) return;
  language = value;
  try { localStorage.setItem(languageKey, value); } catch { /* Session only. */ }
}
export function t(key, values = {}) {
  const label = dictionary.get(key)?.[language] ?? String(key ?? "");
  return label.replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
}
const original = new WeakMap();
export function localize(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const source = original.get(node) ?? node.nodeValue;
    original.set(node, source);
    node.nodeValue = source.replace(/^(\s*)(.*?)(\s*)$/, (_, start, key, end) => start + t(key) + end);
  }
  for (const element of root.querySelectorAll("[aria-label], [placeholder], [title]")) {
    const attrs = original.get(element) ?? Object.fromEntries(["aria-label","placeholder","title"]
      .filter(name => element.hasAttribute(name)).map(name => [name, element.getAttribute(name)]));
    original.set(element, attrs);
    for (const [name, value] of Object.entries(attrs)) element.setAttribute(name, t(value));
  }
}



