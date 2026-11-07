const rows = `
Noch nicht eingeordnet|Unclassified|Da classificare|Sin clasificar
Störung|Incident|Incidente|Incidencia
Serviceanfrage|Service request|Richiesta di servizio|Solicitud de servicio
Servicekatalog|Service catalogue|Catalogo dei servizi|Catálogo de servicios
Vorlage auswählen (optional)|Choose a template (optional)|Scegli un modello (facoltativo)|Elige una plantilla (opcional)
ERP-Berechtigung|ERP access|Accesso ERP|Acceso al ERP
Notebook bereitstellen|Request a laptop|Richiedi un portatile|Solicitar un portátil
VPN-Zugang|VPN access|Accesso VPN|Acceso VPN
Gemeinsames Postfach|Shared mailbox|Casella di posta condivisa|Buzón compartido
Nenne das ERP-System, die benötigte Rolle und den gewünschten Gültigkeitszeitraum.|Specify the ERP system, required role and desired validity period.|Indica il sistema ERP, il ruolo richiesto e il periodo di validità.|Indica el sistema ERP, el rol requerido y el periodo de validez.
Nenne Einsatzort, Einsatzbeginn und besondere Anforderungen.|Specify the location, start date and any special requirements.|Indica sede, data di inizio ed eventuali requisiti particolari.|Indica la ubicación, la fecha de inicio y los requisitos especiales.
Nenne Gerät, Einsatzort und den benötigten Zeitraum.|Specify the device, location and required period.|Indica il dispositivo, la sede e il periodo richiesto.|Indica el dispositivo, la ubicación y el periodo necesario.
Nenne den gewünschten Postfachnamen und die Personen, die Zugriff brauchen.|Specify the mailbox name and who needs access.|Indica il nome della casella e chi deve accedervi.|Indica el nombre del buzón y quién necesita acceso.
Kommunikation|Communication|Comunicazione|Comunicación
Art der Rückmeldung|Message type|Tipo di messaggio|Tipo de mensaje
Rückfrage|Follow-up question|Domanda di chiarimento|Pregunta de seguimiento
Antwort|Reply|Risposta|Respuesta
Interne Notiz|Internal note|Nota interna|Nota interna
Nachricht|Message|Messaggio|Mensaje
{kind}: {note}|{kind}: {note}|{kind}: {note}|{kind}: {note}
Freigabe|Approval|Approvazione|Aprobación
Keine Freigabe erfasst|No approval recorded|Nessuna approvazione registrata|Sin aprobación registrada
Keine Änderung|No change|Nessuna modifica|Sin cambios
Freigabeaktion|Approval action|Azione di approvazione|Acción de aprobación
Freigabe anfragen|Request approval|Richiedi approvazione|Solicitar aprobación
Genehmigen|Approve|Approva|Aprobar
Ablehnen|Reject|Rifiuta|Rechazar
Freigabe ausstehend|Approval pending|Approvazione in sospeso|Aprobación pendiente
Genehmigt|Approved|Approvato|Aprobada
Freigebende Person|Approver|Responsabile dell’approvazione|Responsable de aprobar
Begründung der Freigabe|Approval rationale|Motivazione dell’approvazione|Motivo de la aprobación
Bitte Person und Begründung angeben. Für eine Entscheidung muss eine Freigabe offen sein.|Enter a person and a reason. A decision requires a pending approval.|Indica una persona e una motivazione. Per decidere occorre una richiesta in sospeso.|Indica una persona y un motivo. Para decidir debe haber una aprobación pendiente.
{status} · {person}: {reason}|{status} · {person}: {reason}|{status} · {person}: {reason}|{status} · {person}: {reason}
Ticketbeziehungen|Ticket relationships|Relazioni tra ticket|Relaciones entre tickets
Beziehungstyp|Relationship type|Tipo di relazione|Tipo de relación
Verknüpftes Ticket|Linked ticket|Ticket collegato|Ticket vinculado
Ticket auswählen|Select a ticket|Seleziona un ticket|Selecciona un ticket
Verwandt|Related|Correlato|Relacionado
Duplikat von|Duplicate of|Duplicato di|Duplicado de
Blockiert durch|Blocked by|Bloccato da|Bloqueado por
Wird behoben durch|Resolved by|Risolto da|Resuelto por
Beziehung entfernen|Remove relationship|Rimuovi relazione|Quitar relación
Entfernen rückgängig|Undo removal|Annulla rimozione|Deshacer eliminación
Beziehung entfernt: {ticket}|Relationship removed: {ticket}|Relazione rimossa: {ticket}|Relación eliminada: {ticket}
{kind}: {ticket}|{kind}: {ticket}|{kind}: {ticket}|{kind}: {ticket}
Diese Ticketbeziehung ist bereits vorhanden oder ungültig.|This relationship already exists or is invalid.|Questa relazione esiste già o non è valida.|Esta relación ya existe o no es válida.
Zum verknüpften Ticket wechseln? Ungespeicherte Änderungen gehen verloren.|Open the linked ticket? Unsaved changes will be lost.|Aprire il ticket collegato? Le modifiche non salvate andranno perse.|¿Abrir el ticket vinculado? Se perderán los cambios sin guardar.
Änderungsantrag|Change request|Richiesta di modifica|Solicitud de cambio
Neues Vorhaben|New initiative|Nuova iniziativa|Nueva iniciativa
Neu|New|Nuovo|Nuevo
In Bearbeitung|In progress|In lavorazione|En curso
Wartet auf Rückmeldung|Awaiting response|In attesa di risposta|En espera de respuesta
Abgeschlossen|Closed|Chiuso|Cerrado
Niedrig|Low|Bassa|Baja
Normal|Normal|Normale|Normal
Hoch|High|Alta|Alta
Kritisch|Critical|Critica|Crítica
Sofort|Immediate|Immediata|Inmediata
Nicht beantragt|Not requested|Non richiesta|No solicitada
In Prüfung|Under review|In valutazione|En revisión
Abgelehnt|Rejected|Respinta|Rechazada
Als Projekt übernommen|Accepted as a project|Approvata come progetto|Aceptado como proyecto
Arbeitsplatz & Hardware|Workplace & hardware|Postazione di lavoro e hardware|Puesto de trabajo y equipos
Zugänge & Berechtigungen|Access & permissions|Accessi e autorizzazioni|Accesos y permisos
E-Mail & Zusammenarbeit|Email & collaboration|Email e collaborazione|Correo y colaboración
Netzwerk & VPN|Network & VPN|Rete e VPN|Red y VPN
Sonstiger IT-Service|Other IT service|Altro servizio IT|Otro servicio de TI
Vertrieb|Sales|Vendite|Ventas
Wissenschaft / Forschung|Science / Research|Scienza / Ricerca|Ciencia e investigación
Geschäftsführung|Executive management|Direzione|Dirección
Bereichsübergreifend|Cross-functional|Interfunzionale|Interdepartamental
Zuordnung offen|Unassigned|Assegnazione da definire|Sin asignar
Andere Person|Other person|Altra persona|Otra persona
Alle Abteilungen|All departments|Tutti i reparti|Todos los departamentos
Bitte auswählen|Select an option|Seleziona un’opzione|Selecciona una opción
Ansicht|View|Vista|Vista
Alle Tickets|All tickets|Tutti i ticket|Todos los tickets
Handlungsbedarf|Needs attention|Richiede attenzione|Requiere atención
Meine Anliegen|My requests|Le mie richieste|Mis solicitudes
Person auswählen|Select a person|Seleziona una persona|Selecciona una persona
Prioritätsvorschlag aus Auswirkung und Dringlichkeit: {priority}|Suggested priority based on impact and urgency: {priority}|Priorità suggerita in base a impatto e urgenza: {priority}|Prioridad sugerida según impacto y urgencia: {priority}
Vorschlag übernehmen|Apply suggestion|Applica suggerimento|Aplicar sugerencia
Alle Typen|All types|Tutti i tipi|Todos los tipos
Alle Status|All statuses|Tutti gli stati|Todos los estados
Offene Tickets|Open tickets|Ticket aperti|Tickets abiertos
Neue Tickets|New tickets|Nuovi ticket|Tickets nuevos
Hoch oder kritisch|High or critical|Alta o critica|Alta o crítica
Kachelfilter entfernen|Clear tile filter|Rimuovi filtro del riquadro|Quitar filtro del indicador
{label}: {shown} von {total} Tickets|{label}: {shown} of {total} tickets|{label}: {shown} di {total} ticket|{label}: {shown} de {total} tickets
In Projektprüfung|In project review|In valutazione come progetto|En evaluación de proyecto
Keine Tickets für diese Auswahl.|No tickets match this selection.|Nessun ticket corrisponde alla selezione.|Ningún ticket coincide con la selección.
Abbrechen|Cancel|Annulla|Cancelar
Speichern|Save|Salva|Guardar
TICKETANLAGE · IT|CREATE TICKET · IT|NUOVO TICKET · IT|CREAR TICKET · TI
Neues Anliegen|New ticket|Nuovo ticket|Nuevo ticket
Betreff|Subject|Oggetto|Asunto
Abteilung der anfragenden Person|Requester’s department|Reparto del richiedente|Departamento del solicitante
Anfragende Person|Requester|Richiedente|Solicitante
Name der anfragenden Person|Requester’s name|Nome del richiedente|Nombre del solicitante
Anliegenstyp|Request type|Tipo di richiesta|Tipo de solicitud
Arbeitsbereich|Workspace|Area di lavoro|Área de trabajo
Demo-Ansicht|Demo view|Vista dimostrativa|Vista de demostración
Anliegenportal|Request portal|Portale richieste|Portal de solicitudes
IT-Arbeitsplatz|IT workspace|Area di lavoro IT|Área de trabajo de TI
IT-Mitarbeitende|IT staff member|Operatore IT|Personal de TI
Demo-Rollenwechsel ohne Anmeldung.|Demo role switching without sign-in.|Cambio ruolo dimostrativo senza accesso.|Cambio de rol de demostración sin inicio de sesión.
Melde ein Anliegen und verfolge die Rückmeldungen der IT.|Submit a request and follow IT's replies.|Invia una richiesta e segui le risposte del team IT.|Envía una solicitud y sigue las respuestas de TI.
Betroffener Service|Affected service|Servizio interessato|Servicio afectado
Noch nicht bekannt|Not known yet|Non ancora noto|Aún no se sabe
Dringlichkeit (Einschätzung)|Reported urgency|Urgenza segnalata|Urgencia indicada
Gemeldete Dringlichkeit|Reported urgency|Urgenza segnalata|Urgencia indicada
Beschreibung|Description|Descrizione|Descripción
Beschreibung formatieren|Format description|Formatta la descrizione|Dar formato a la descripción
Erstbewertung|Triage|Valutazione iniziale|Evaluación inicial
Nächster Schritt|Next step|Prossimo passo|Siguiente paso
Vorgang abgeschlossen.|Ticket closed.|Ticket chiuso.|Ticket cerrado.
Bearbeitungsstatus|Status|Stato|Estado
Status|Status|Stato|Estado
Link zur Kanban-Karte|Kanban card link|Link alla scheda Kanban|Enlace a tarjeta Kanban
Kanban-Karte öffnen|Open Kanban card|Apri scheda Kanban|Abrir tarjeta Kanban
Übergabe kopieren|Copy handoff|Copia passaggio di consegne|Copiar traspaso
Ticketnummer, Betreff und Rücklink kopiert.|Ticket number, subject and backlink copied.|Numero, oggetto e link al ticket copiati.|Número, asunto y enlace al ticket copiados.
Kopieren nicht möglich.|Unable to copy.|Impossibile copiare.|No se pudo copiar.
Bitte einen Kartenlink vom lokalen Kanban-Board einfügen.|Paste a card link from the local Kanban board.|Incolla il link di una scheda della bacheca Kanban locale.|Pega un enlace de tarjeta del tablero Kanban local.
Priorität|Priority|Priorità|Prioridad
Zuständige Person|Assignee|Assegnatario|Responsable
Zuständigkeit|Assignment|Assegnazione|Asignación
Projektentscheidung|Project decision|Decisione sul progetto|Decisión de proyecto
Projektreferenz|Project reference|Riferimento del progetto|Referencia del proyecto
Projektbegründung|Project rationale|Motivazione del progetto|Justificación del proyecto
Begründung der Projektentscheidung|Reason for the project decision|Motivazione della decisione sul progetto|Motivo de la decisión de proyecto
Verlaufsnotiz|Activity note|Nota per la cronologia|Nota de actividad
Verlauf|Activity|Cronologia|Historial
Anhänge|Attachments|Allegati|Adjuntos
Dateien aus dem Explorer hierher ziehen oder auswählen.|Drag files here from Explorer or select them.|Trascina qui i file da Esplora file oppure selezionali.|Arrastra archivos desde el Explorador o selecciónalos.
Anhänge auswählen|Select attachments|Seleziona allegati|Seleccionar adjuntos
Bis zu 10 MB pro Datei und 40 MB pro Ticket.|Up to 10 MB per file and 40 MB per ticket.|Fino a 10 MB per file e 40 MB per ticket.|Hasta 10 MB por archivo y 40 MB por ticket.
Herunterladen|Download|Scarica|Descargar
Entfernen|Remove|Rimuovi|Quitar
{file} überschreitet das Größenlimit.|{file} exceeds the size limit.|{file} supera il limite di dimensione.|{file} supera el límite de tamaño.
SAP Transformation Lab · Interner Service|SAP Transformation Lab · Internal Service|SAP Transformation Lab · Servizi interni|SAP Transformation Lab · Servicio interno
IT-SERVICEBEREICH|IT SERVICE DESK|SERVIZIO IT|SERVICIO DE TI
Ticketübersicht|Ticket overview|Panoramica dei ticket|Vista general de tickets
Anliegen aufnehmen, bewerten und weiterverfolgen.|Capture, assess and track requests.|Registra, valuta e segui le richieste.|Registra, evalúa y sigue las solicitudes.
＋ Neues Ticket|＋ New ticket|＋ Nuovo ticket|＋ Nuevo ticket
Kennzahlen|Metrics|Indicatori|Indicadores
Tickets durchsuchen|Search tickets|Cerca ticket|Buscar tickets
Ticketnummer oder Stichwort suchen|Search by ticket number or keyword|Cerca per numero di ticket o parola chiave|Busca por número de ticket o palabra clave
Tickettyp filtern|Filter by request type|Filtra per tipo di richiesta|Filtrar por tipo de solicitud
Status filtern|Filter by status|Filtra per stato|Filtrar por estado
Prototyp mit fiktiven LLSG-Daten. Tickets und Anhänge werden in diesem Browser gespeichert.|Prototype with fictional LLSG data. Tickets and attachments are stored in this browser.|Prototipo con dati LLSG fittizi. Ticket e allegati vengono salvati in questo browser.|Prototipo con datos ficticios de LLSG. Los tickets y adjuntos se guardan en este navegador.
Schließen|Close|Chiudi|Cerrar
Sprache|Language|Lingua|Idioma
Beschreibe dein Anliegen in eigenen Worten. Die IT übernimmt die Einordnung.|Describe your request in your own words. IT will classify it.|Descrivi la richiesta con parole tue. Il team IT la classificherà.|Describe tu solicitud con tus propias palabras. TI la clasificará.
Anliegen sichten und einem Bearbeitungsweg zuordnen.|Review and route the request.|Esamina e instrada la richiesta.|Revisa y deriva la solicitud.
Beschreibe, was ausgefallen ist und wie stark die Arbeit betroffen ist.|Describe what stopped working and how much it affects your work.|Descrivi cosa ha smesso di funzionare e in che misura incide sul lavoro.|Describe qué dejó de funcionar y cuánto afecta al trabajo.
Wer ist betroffen?|Who is affected?|Chi è coinvolto?|¿A quién afecta?
Nur ich|Just me|Solo io|Solo a mí
Ein Team|One team|Un team|Un equipo
Mehrere Teams|Several teams|Più team|Varios equipos
Ganze Organisation|Entire organisation|Intera organizzazione|Toda la organización
Gibt es einen Ausweichweg?|Is there a workaround?|Esiste una soluzione temporanea?|¿Existe una solución provisional?
Ja|Yes|Sì|Sí
Nein|No|No|No
Auswirkung und Dringlichkeit prüfen und den Betrieb wiederherstellen.|Assess impact and urgency, then restore service.|Valuta impatto e urgenza, quindi ripristina il servizio.|Evalúa el impacto y la urgencia, y restablece el servicio.
Gib an, für wen und bis wann die Leistung gebraucht wird.|Say who needs the service and by when.|Indica chi ha bisogno del servizio e per quando.|Indica quién necesita el servicio y para cuándo.
Für wen ist die Anfrage?|Who is the request for?|Per chi è la richiesta?|¿Para quién es la solicitud?
Für mich|For me|Per me|Para mí
Für eine andere Person|For someone else|Per un’altra persona|Para otra persona
Für ein Team|For a team|Per un team|Para un equipo
Benötigt bis|Needed by|Necessario entro|Fecha límite
Standardleistung und erforderliche Freigabe prüfen.|Check the standard service and any required approval.|Verifica il servizio standard e l’eventuale approvazione richiesta.|Comprueba el servicio estándar y la aprobación necesaria.
Beschreibe den heutigen Zustand und das gewünschte Ergebnis.|Describe the current situation and the desired outcome.|Descrivi la situazione attuale e il risultato desiderato.|Describe la situación actual y el resultado deseado.
Welche Art von Änderung?|What kind of change?|Quale tipo di modifica?|¿Qué tipo de cambio?
Konfiguration|Configuration|Configurazione|Configuración
Funktionserweiterung|Feature enhancement|Estensione funzionale|Mejora funcional
Schnittstelle|Integration|Interfaccia|Integración
Sonstiges|Other|Altro|Otro
Gewünschter Termin|Requested date|Data richiesta|Fecha solicitada
Auswirkungen und Risiken bewerten und über Freigabe oder Projektprüfung entscheiden.|Assess impact and risk, then decide on approval or project review.|Valuta impatto e rischi, quindi decidi se approvare o avviare la valutazione del progetto.|Evalúa el impacto y el riesgo, y decide si procede aprobarlo o evaluarlo como proyecto.
Beschreibe das angestrebte Ergebnis und wer davon profitiert.|Describe the intended outcome and who benefits.|Descrivi il risultato atteso e chi ne beneficia.|Describe el resultado esperado y quién se beneficiará.
Welche Abstimmung ist absehbar?|Who needs to coordinate?|Chi dovrà coordinarsi?|¿Quién debe coordinarse?
Externe Beteiligte|External participants|Soggetti esterni|Participantes externos
Ziel, Nutzen und Zuständigkeit klären und bei Bedarf zur Projektprüfung geben.|Clarify the goal, benefits and ownership, then refer for project review if needed.|Chiarisci obiettivo, benefici e responsabilità, quindi avvia la valutazione del progetto se necessario.|Aclara el objetivo, los beneficios y la responsabilidad, y deriva a evaluación de proyecto si procede.
Bitte Betreff, anfragende Person und eine Beschreibung mit bis zu 3.000 Zeichen eingeben.|Enter a subject, a requester and a description of up to 3,000 characters.|Inserisci oggetto, richiedente e una descrizione di massimo 3.000 caratteri.|Introduce un asunto, un solicitante y una descripción de hasta 3000 caracteres.
Für die Projektübernahme ist eine Projektreferenz erforderlich.|A project reference is required to accept the ticket as a project.|Per approvare il ticket come progetto serve un riferimento al progetto.|Se requiere una referencia para aceptar el ticket como proyecto.
Bitte die Projektentscheidung begründen.|Enter a reason for the project decision.|Indica il motivo della decisione sul progetto.|Indica el motivo de la decisión de proyecto.
Der Datenstand wurde in einem anderen Tab geändert. Bitte lade die Seite neu und wiederhole die Änderung.|The data changed in another tab. Reload this page and try again.|I dati sono cambiati in un’altra scheda. Ricarica la pagina e riprova.|Los datos cambiaron en otra pestaña. Recarga la página e inténtalo de nuevo.
Die Änderung konnte nicht gespeichert werden. Bitte prüfe den verfügbaren Browserspeicher.|The change could not be saved. Check available browser storage.|Impossibile salvare la modifica. Controlla lo spazio disponibile nel browser.|No se pudo guardar el cambio. Comprueba el almacenamiento del navegador.
Der Browserspeicher ist nicht verfügbar. Bitte öffne den Prototyp in einem normalen Browserfenster.|Browser storage is unavailable. Open the prototype in a regular browser window.|L’archiviazione del browser non è disponibile. Apri il prototipo in una finestra normale.|El almacenamiento del navegador no está disponible. Abre el prototipo en una ventana normal.
{ticket} wurde angelegt.|{ticket} was created.|{ticket} è stato creato.|Se creó {ticket}.
{ticket} wurde aktualisiert.|{ticket} was updated.|{ticket} è stato aggiornato.|Se actualizó {ticket}.
Ticket angelegt|Ticket created|Ticket creato|Ticket creado
Fiktiver Pilotfall angelegt|Fictional demo ticket created|Ticket dimostrativo creato|Ticket ficticio de demostración creado
{field} geändert: {before} → {after}|{field} changed: {before} → {after}|{field}: {before} → {after}|Cambio en {field}: {before} → {after}
Anhang hinzugefügt: {file}|Attachment added: {file}|Allegato aggiunto: {file}|Adjunto añadido: {file}
Anhang entfernt: {file}|Attachment removed: {file}|Allegato rimosso: {file}|Adjunto eliminado: {file}
Sprache des Originals|Original language|Lingua dell’originale|Idioma original
Originalsprache unbekannt|Original language unknown|Lingua originale sconosciuta|Idioma original desconocido
Zielsprache|Target language|Lingua di destinazione|Idioma de destino
Mit KI übersetzen|Translate with AI|Traduci con IA|Traducir con IA
Übersetzung wird erstellt …|Translating…|Traduzione in corso…|Traduciendo…
KI-Übersetzung|AI translation|Traduzione con IA|Traducción con IA
Dieser Browser stellt die lokale KI-Übersetzung nicht bereit. Öffne das Ticket in einer unterstützten Desktop-Version von Chrome oder Edge.|This browser does not provide on-device AI translation. Open the ticket in a supported desktop version of Chrome or Edge.|Questo browser non offre la traduzione IA locale. Apri il ticket in una versione desktop compatibile di Chrome o Edge.|Este navegador no ofrece traducción local con IA. Abre el ticket en una versión de escritorio compatible de Chrome o Edge.
Dieses Sprachpaar ist im Browser nicht verfügbar.|This language pair is unavailable in this browser.|Questa coppia di lingue non è disponibile nel browser.|Este par de idiomas no está disponible en el navegador.
Die Übersetzung konnte nicht erstellt werden. Bitte versuche es erneut.|Translation failed. Please try again.|Traduzione non riuscita. Riprova.|No se pudo traducir. Inténtalo de nuevo.
Fett|Bold|Grassetto|Negrita
Kursiv|Italic|Corsivo|Cursiva
Unterstrichen|Underline|Sottolineato|Subrayado
Durchgestrichen|Strikethrough|Barrato|Tachado
Schriftfarbe|Text colour|Colore del testo|Color del texto
Standard|Default|Predefinito|Predeterminado
Rot|Red|Rosso|Rojo
Grün|Green|Verde|Verde
Blau|Blue|Blu|Azul
Violett|Purple|Viola|Morado
Orange|Orange|Arancione|Naranja
Gemischt|Mixed|Misto|Mixto
Hervorhebung|Highlight|Evidenziazione|Resaltado
Keine Farbe|No colour|Nessun colore|Sin color
Gelb|Yellow|Giallo|Amarillo
Rosa|Pink|Rosa|Rosa
Schriftgröße|Font size|Dimensione del carattere|Tamaño de letra
Klein · 14|Small · 14|Piccolo · 14|Pequeño · 14
Normal · 16|Normal · 16|Normale · 16|Normal · 16
Groß · 20|Large · 20|Grande · 20|Grande · 20
Sehr groß · 24|Extra large · 24|Molto grande · 24|Muy grande · 24
Aufzählung|Bulleted list|Elenco puntato|Lista con viñetas
Nummerierte Liste|Numbered list|Elenco numerato|Lista numerada
• Liste|• List|• Elenco|• Lista
1. Liste|1. List|1. Elenco|1. Lista
Formatierung entfernen|Clear formatting|Rimuovi formattazione|Quitar formato
Textänderung rückgängig|Undo text change|Annulla modifica del testo|Deshacer cambio de texto
Textänderung wiederholen|Redo text change|Ripristina modifica del testo|Rehacer cambio de texto
Fett (Strg+B)|Bold (Ctrl+B)|Grassetto (Ctrl+B)|Negrita (Ctrl+B)
Kursiv (Strg+I)|Italic (Ctrl+I)|Corsivo (Ctrl+I)|Cursiva (Ctrl+I)
Unterstrichen (Strg+U)|Underline (Ctrl+U)|Sottolineato (Ctrl+U)|Subrayado (Ctrl+U)
Aufzählung ein-/ausschalten|Toggle bulleted list|Attiva o disattiva elenco puntato|Activar o desactivar viñetas
Nummerierung ein-/ausschalten|Toggle numbered list|Attiva o disattiva numerazione|Activar o desactivar numeración
Formatierung im markierten Text entfernen|Clear formatting in selected text|Rimuovi la formattazione dal testo selezionato|Quitar formato del texto seleccionado
Im Text rückgängig (Strg+Z)|Undo (Ctrl+Z)|Annulla (Ctrl+Z)|Deshacer (Ctrl+Z)
Im Text wiederholen (Strg+Y)|Redo (Ctrl+Y)|Ripristina (Ctrl+Y)|Rehacer (Ctrl+Y)
Lesesprache des Tickets|Ticket reading language|Lingua di lettura del ticket|Idioma de lectura del ticket
Original anzeigen|Show original|Mostra originale|Mostrar original
Übersetzung anzeigen|Show translation|Mostra traduzione|Mostrar traducción
Sprachmodell wird geladen: {percent} %|Downloading language model: {percent}%|Download del modello linguistico: {percent}%|Descargando modelo de idioma: {percent} %
Antwort senden|Send reply|Invia risposta|Enviar respuesta
Sprache der Nachricht|Message language|Lingua del messaggio|Idioma del mensaje
Screenshot markieren|Annotate screenshot|Annota schermata|Marcar captura
Screenshot einfügen oder auswählen. Markierungen und Schwärzungen werden in die Vorschau eingebrannt.|Paste or select a screenshot. Annotations and redactions are flattened into the preview.|Incolla o seleziona una schermata. Annotazioni e oscuramenti vengono incorporati nell’anteprima.|Pega o selecciona una captura. Las marcas y los tachados se incorporan a la vista previa.
Screenshot auswählen|Choose screenshot|Seleziona schermata|Seleccionar captura
Werkzeug|Tool|Strumento|Herramienta
Markieren|Annotate|Annota|Marcar
Schwärzen|Redact|Oscura|Ocultar
Rückgängig|Undo|Annulla|Deshacer
Vorschau als Anhang übernehmen|Attach preview|Allega anteprima|Adjuntar vista previa
Screenshot-Vorschau|Screenshot preview|Anteprima schermata|Vista previa de la captura
Bitte ein PNG-, JPEG- oder WebP-Bild bis 20 MB auswählen.|Choose a PNG, JPEG or WebP image up to 20 MB.|Scegli un’immagine PNG, JPEG o WebP fino a 20 MB.|Selecciona una imagen PNG, JPEG o WebP de hasta 20 MB.
Das Bild konnte nicht geöffnet werden.|The image could not be opened.|Impossibile aprire l’immagine.|No se pudo abrir la imagen.
Vorschau als Anhang übernommen.|Preview attached.|Anteprima allegata.|Vista previa adjuntada.
Rückmeldung erbeten|Response requested|Riscontro richiesto|Respuesta solicitada
Fehler besteht noch|Issue persists|Il problema persiste|El problema continúa
Test erfolgreich|Test passed|Test riuscito|Prueba superada
Bekannte Störung gefunden. Du kannst dich als betroffen melden.|A known incident matches. You can report that you are affected.|È presente un incidente noto. Puoi segnalare di essere coinvolto.|Hay una incidencia conocida. Puedes indicar que te afecta.
Bekannte Störung|Known incident|Incidente noto|Incidencia conocida
Eigenes Ticket erfassen|Create a separate ticket|Crea un ticket separato|Crear un ticket independiente
Ich bin betroffen|I am affected|Sono coinvolto|Me afecta
Ich bin von dieser Störung betroffen.|I am affected by this incident.|Sono coinvolto in questo incidente.|Esta incidencia me afecta.
Du hast dich für diese Störung bereits als betroffen gemeldet.|You have already reported being affected by this incident.|Hai già segnalato di essere coinvolto in questo incidente.|Ya has indicado que esta incidencia te afecta.
Abnahme der Umsetzung|Implementation acceptance|Collaudo dell’implementazione|Validación de la implementación
Was ist noch offen?|What is still unresolved?|Che cosa resta da risolvere?|¿Qué sigue sin resolverse?
Funktioniert|It works|Funziona|Funciona
Status der Sammelstörung|Shared incident status|Stato dell’incidente condiviso|Estado de la incidencia compartida
Bitte beschreibe, was noch nicht funktioniert.|Describe what still does not work.|Descrivi cosa non funziona ancora.|Describe qué sigue sin funcionar.
Testergebnis: {result}|Test result: {result}|Esito del test: {result}|Resultado de la prueba: {result}
Test und Abnahme|Testing and acceptance|Test e collaudo|Pruebas y validación
Bitte um einen Funktionstest|Request a functional test|Richiesta di test funzionale|Solicitud de prueba funcional
Kanban-Aktion|Kanban action|Azione Kanban|Acción de Kanban
Übergabe vorbereiten|Prepare handoff|Prepara il passaggio|Preparar traspaso
Abnahme anfordern|Request acceptance|Richiedi il collaudo|Solicitar validación
Ziel der Umsetzung|Implementation objective|Obiettivo dell’implementazione|Objetivo de la implementación
Projekt|Project|Progetto|Proyecto
Zielspalte|Target column|Colonna di destinazione|Columna de destino
Abnahmekriterien|Acceptance criteria|Criteri di collaudo|Criterios de aceptación
Kanban-Entwurf prüfen|Review Kanban draft|Controlla la bozza Kanban|Revisar borrador Kanban
Kanban-Board öffnen|Open Kanban board|Apri bacheca Kanban|Abrir tablero Kanban
Entwurf kopieren|Copy draft|Copia bozza|Copiar borrador
Sammelstörung|Shared incident|Incidente condiviso|Incidencia compartida
Sammelstörungsaktion|Shared incident action|Azione sull’incidente condiviso|Acción sobre incidencia compartida
Als Sammelstörung veröffentlichen|Publish as a shared incident|Pubblica come incidente condiviso|Publicar como incidencia compartida
Sammelstörung beenden|Resolve shared incident|Chiudi l’incidente condiviso|Cerrar incidencia compartida
Öffentlicher Störungstitel|Public incident title|Titolo pubblico dell’incidente|Título público de la incidencia
Statusmeldung für Betroffene|Status update for affected users|Aggiornamento per le persone coinvolte|Actualización para las personas afectadas
Sammelstörung aktiv|Shared incident active|Incidente condiviso attivo|Incidencia compartida activa
Sammelstörung beendet|Shared incident resolved|Incidente condiviso chiuso|Incidencia compartida cerrada
{count} betroffene Personen|{count} affected people|{count} persone coinvolte|{count} personas afectadas
Diagnose und Schichtübergabe|Diagnosis and shift handoff|Diagnosi e passaggio di turno|Diagnóstico y traspaso de turno
Diagnoseentwurf anzeigen|Show triage draft|Mostra bozza di diagnosi|Mostrar borrador de diagnóstico
Schichtübergabe anzeigen|Show shift handoff|Mostra passaggio di turno|Mostrar traspaso de turno
Gemeldete Fakten|Reported facts|Fatti segnalati|Hechos comunicados
Offene Fragen|Open questions|Domande aperte|Preguntas pendientes
Bildanhänge|Image attachments|Immagini allegate|Imágenes adjuntas
KI-Entwurf (Englisch, bitte prüfen)|AI draft (English, review required)|Bozza IA (inglese, da verificare)|Borrador de IA (en inglés, requiere revisión)
Belegte Rückmeldungen und Entscheidungen|Sourced replies and decisions|Risposte e decisioni documentate|Respuestas y decisiones documentadas
Noch keine Rückmeldungen oder Entscheidungen dokumentiert.|No replies or decisions have been recorded yet.|Non ci sono ancora risposte o decisioni registrate.|Aún no se han registrado respuestas ni decisiones.
Kanban-Entwurf kopiert. Lege die Karte im Board an und hinterlege ihren Link.|Kanban draft copied. Create the card on the board and add its link here.|Bozza Kanban copiata. Crea la scheda nella bacheca e aggiungi qui il suo link.|Borrador Kanban copiado. Crea la tarjeta en el tablero y añade aquí su enlace.
Für die Übergabe brauchst du einen genehmigten Change, ein Ziel und Abnahmekriterien.|Handoff requires an approved change, an objective and acceptance criteria.|Il passaggio richiede una modifica approvata, un obiettivo e criteri di collaudo.|El traspaso requiere un cambio aprobado, un objetivo y criterios de aceptación.
Kanban-Übergabe vorbereitet|Kanban handoff prepared|Passaggio Kanban preparato|Traspaso a Kanban preparado
Abnahme angefordert|Acceptance requested|Collaudo richiesto|Validación solicitada
Bitte zuerst die Umsetzung vorbereiten und die Kanban-Karte verlinken.|Prepare the implementation and link the Kanban card first.|Prepara prima l’implementazione e collega la scheda Kanban.|Primero prepara la implementación y vincula la tarjeta Kanban.
Test angefordert|Test requested|Test richiesto|Prueba solicitada
Für eine Sammelstörung brauchst du eine Störung mit öffentlichem Titel.|A shared incident requires an incident with a public title.|Un incidente condiviso richiede un incidente con un titolo pubblico.|Una incidencia compartida requiere una incidencia con un título público.
Sammelstörung aktualisiert|Shared incident updated|Incidente condiviso aggiornato|Incidencia compartida actualizada
`;
const dictionary = new Map(rows.trim().split("\n").map(row => {
  const [key, en, it, es] = row.split("|");
  return [key, {en, it, es}];
}));
export const languages = {de:"Deutsch", en:"English", it:"Italiano", es:"Español"};
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







