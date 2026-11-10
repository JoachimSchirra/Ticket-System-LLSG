const rows = `
Rechnungsbuchung im ERP schlägt fehl|Invoice posting fails in ERP|Registrazione della fattura non riuscita nell’ERP|Error al contabilizar una factura en el ERP
ERP-Buchhaltungsrolle beantragen|Request an ERP accounting role|Richiedere un ruolo di contabilità nell’ERP|Solicitar un rol de contabilidad en el ERP
Zweite ERP-Freigabestufe ergänzen|Add a second ERP approval step|Aggiungere un secondo livello di approvazione nell’ERP|Añadir un segundo nivel de aprobación en el ERP
Lieferantenportal einführen|Launch a supplier portal|Avviare un portale per fornitori|Puesta en marcha de un portal para proveedores

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
Anhang aktualisiert: {file}|Attachment updated: {file}|Allegato aggiornato: {file}|Adjunto actualizado: {file}
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
Sprache deiner neuen Nachricht|Language of your new message|Lingua del nuovo messaggio|Idioma de tu nuevo mensaje
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
Servicebereich|Service area|Area di servizio|Área de servicio
Alle Servicebereiche|All service areas|Tutte le aree di servizio|Todas las áreas de servicio
Marketing|Marketing|Marketing|Marketing
Einkauf|Procurement|Acquisti|Compras
Personalbescheinigung|Employment certificate|Certificato di lavoro|Certificado laboral
Eintritt und Austritt|Onboarding and offboarding|Ingresso e uscita|Incorporación y salida
Marketingmaterial|Marketing materials|Materiale di marketing|Material de marketing
Kampagnenunterstützung|Campaign support|Supporto alle campagne|Apoyo a campañas
Beschaffungsanfrage|Procurement request|Richiesta di acquisto|Solicitud de compra
Lieferantenanlage|Supplier registration|Registrazione fornitore|Alta de proveedor
Problem|Problem|Problema|Problema
Dokumentiere wiederkehrende Störungen und die vermutete Ursache.|Document recurring incidents and their suspected cause.|Documenta gli incidenti ricorrenti e la causa sospetta.|Documenta las incidencias recurrentes y su posible causa.
Ursache untersuchen und einen dauerhaften Change verknüpfen.|Investigate the cause and link a permanent change.|Indaga la causa e collega una modifica permanente.|Investiga la causa y vincula un cambio permanente.
Ursachenanalyse|Root cause analysis|Analisi della causa principale|Análisis de causa raíz
Ursache untersucht in|Cause investigated in|Causa analizzata in|Causa investigada en
Dauerhafte Korrektur|Permanent fix|Correzione permanente|Corrección permanente
Verknüpfe eine Störung mit einem Problem und ein Problem mit einem Änderungsantrag.|Link an incident to a problem and a problem to a change request.|Collega un incidente a un problema e il problema a una richiesta di modifica.|Vincula una incidencia con un problema y el problema con una solicitud de cambio.
System oder Gerät|System or device|Sistema o dispositivo|Sistema o dispositivo
Servicefristen und Wissen|Service deadlines and knowledge|Scadenze di servizio e conoscenza|Plazos de servicio y conocimiento
Reaktionsfrist|Response deadline|Scadenza di risposta|Plazo de respuesta
Lösungsfrist|Resolution deadline|Scadenza di risoluzione|Plazo de resolución
Erfüllt|Met|Rispettata|Cumplido
Verspätet erfüllt|Met late|Rispettata in ritardo|Cumplido con retraso
Überfällig|Overdue|Scaduta|Vencido
Frist naht|Due soon|In scadenza|Vence pronto
Im Zeitrahmen|On track|Nei tempi|Dentro de plazo
Zeitpunkt nicht erfasst|Timestamp not recorded|Data e ora non registrate|Fecha y hora no registradas
Demo-Fristen laufen rund um die Uhr. Eine Fristwarnung priorisiert das Ticket in der Warteschlange.|Demo deadlines run around the clock. Deadline alerts prioritise tickets in the queue.|Le scadenze demo decorrono senza interruzioni. Gli avvisi danno priorità ai ticket in coda.|Los plazos de demostración corren las 24 horas. Los avisos dan prioridad a los tickets en la cola.
Passende Hilfeartikel|Relevant help articles|Articoli di assistenza pertinenti|Artículos de ayuda relacionados
Wissensartikel|Knowledge article|Articolo di conoscenza|Artículo de conocimiento
Hilfeartikel veröffentlichen|Publish help article|Pubblica articolo di assistenza|Publicar artículo de ayuda
Hilfeartikel zurückziehen|Withdraw help article|Ritira articolo di assistenza|Retirar artículo de ayuda
Artikeltitel|Article title|Titolo dell’articolo|Título del artículo
Öffentlicher Lösungsweg|Public solution steps|Procedura di risoluzione pubblica|Pasos públicos de resolución
Zum Veröffentlichen muss das Ticket abgeschlossen sein. Titel und Lösungsweg sind Pflicht.|Close the ticket and enter a title and solution before publishing.|Chiudi il ticket e inserisci titolo e soluzione prima di pubblicare.|Cierra el ticket e indica el título y la solución antes de publicar.
Hilfeartikel veröffentlicht|Help article published|Articolo di assistenza pubblicato|Artículo de ayuda publicado
Hilfeartikel zurückgezogen|Help article withdrawn|Articolo di assistenza ritirato|Artículo de ayuda retirado
Begründung bei Prioritätswechsel|Reason for priority change|Motivo del cambio di priorità|Motivo del cambio de prioridad
Bitte begründe die manuelle Prioritätsänderung.|Enter a reason for the manual priority change.|Indica il motivo del cambio manuale di priorità.|Indica el motivo del cambio manual de prioridad.
Prioritätsbegründung: {note}|Priority rationale: {note}|Motivo della priorità: {note}|Motivo de prioridad: {note}
Eskalationshinweis|Escalation note|Nota di escalation|Nota de escalamiento
Eskalation erfasst|Escalation recorded|Escalation registrata|Escalamiento registrado
Eskalation|Escalation|Escalation|Escalamiento
Ticket nach System|Tickets by system|Ticket per sistema|Tickets por sistema
{count} offene Tickets für {system}|{count} open tickets for {system}|{count} ticket aperti per {system}|{count} tickets abiertos para {system}
Meine IT-Aufgaben|My IT tasks|Le mie attività IT|Mis tareas de TI
Bereits versucht|Already tried|Tentativi effettuati|Ya intentado
Zusage|Commitment|Impegno|Compromiso
Zusagen|Commitments|Impegni|Compromisos
SAP-Geschäftsprozess|SAP business process|Processo aziendale SAP|Proceso empresarial SAP
Prozessschritt|Process step|Fase del processo|Paso del proceso
SAP-Komponente|SAP component|Componente SAP|Componente SAP
Beschaffung bis Zahlung|Procure to pay|Dall’acquisto al pagamento|De la compra al pago
Bestellung anlegen oder freigeben|Create or approve a purchase order|Crea o approva un ordine di acquisto|Crear o aprobar un pedido de compra
Wareneingang buchen|Post goods receipt|Registra entrata merci|Contabilizar entrada de mercancías
Qualitätsprüfung durchführen|Perform quality inspection|Esegui controllo qualità|Realizar inspección de calidad
Lieferantenrechnung prüfen oder buchen|Check or post supplier invoice|Verifica o registra fattura fornitore|Verificar o contabilizar factura de proveedor
Auftrag bis Zahlung|Order to cash|Dall’ordine all’incasso|Del pedido al cobro
Kundenauftrag bearbeiten|Process sales order|Elabora ordine cliente|Procesar pedido de cliente
Lieferung und Warenausgang|Delivery and goods issue|Consegna e uscita merci|Entrega y salida de mercancías
Fakturierung|Billing|Fatturazione|Facturación
Finanzabschluss|Financial close|Chiusura contabile|Cierre financiero
Sachkontenbuchung|General ledger posting|Registrazione in contabilità generale|Contabilización en el libro mayor
Abschluss und Abstimmung|Close and reconciliation|Chiusura e riconciliazione|Cierre y conciliación
Planung und Produktion|Planning and production|Pianificazione e produzione|Planificación y producción
Materialbedarf planen|Plan material requirements|Pianifica il fabbisogno di materiali|Planificar necesidades de materiales
Fertigungsauftrag bearbeiten|Process production order|Elabora ordine di produzione|Procesar orden de fabricación
Technischer Betrieb|Technical operations|Operazioni tecniche|Operaciones técnicas
Schnittstelle oder Hintergrundjob|Interface or background job|Interfaccia o job in background|Interfaz o tarea en segundo plano
Bestellung oder Bestellanforderung|Purchase order or purchase requisition|Ordine o richiesta di acquisto|Pedido o solicitud de compra
Werk und Bestellposition|Plant and purchase order item|Divisione e posizione dell’ordine|Centro y posición del pedido
Werk und Prüflos|Plant and inspection lot|Divisione e lotto di controllo|Centro y lote de inspección
Buchungskreis und Rechnungsreferenz|Company code and invoice reference|Società e riferimento fattura|Sociedad y referencia de factura
Organisation und Belegreferenz|Organisational unit and document reference|Unità organizzativa e riferimento documento|Unidad organizativa y referencia del documento
Fiori-App oder Transaktion|Fiori app or transaction|App Fiori o transazione|Aplicación Fiori o transacción
Fehlermeldung|Error message|Messaggio di errore|Mensaje de error
Lieferantenrechnung kann nicht gebucht werden|Supplier invoice cannot be posted|Impossibile registrare la fattura fornitore|No se puede contabilizar la factura de proveedor
Wareneingang kann nicht gebucht werden|Goods receipt cannot be posted|Impossibile registrare l’entrata merci|No se puede contabilizar la entrada de mercancías
Prüflos fehlt oder Verwendungsentscheid ist blockiert|Inspection lot missing or usage decision blocked|Lotto di controllo mancante o decisione di impiego bloccata|Falta el lote de inspección o está bloqueada la decisión de empleo
Freigaberegel für Bestellungen ändern|Change the purchase order approval rule|Modifica regola di approvazione ordini|Cambiar regla de aprobación de pedidos
SAP-Schnittstelle oder Hintergrundjob gestört|SAP interface or background job failed|Problema con interfaccia o job SAP|Incidencia en interfaz o tarea SAP
Nenne die benötigte SAP-Rolle, das Zielsystem und den Gültigkeitszeitraum.|Specify the required SAP role, target system and validity period.|Indica il ruolo SAP, il sistema e il periodo di validità.|Indica el rol SAP, el sistema de destino y el periodo de validez.
Nenne den Buchungskreis, die Fiori-App oder Transaktion und die genaue Fehlermeldung.|Provide the company code, Fiori app or transaction and exact error message.|Indica la società, l’app Fiori o transazione e il messaggio di errore esatto.|Indica la sociedad, la aplicación Fiori o transacción y el mensaje de error exacto.
Nenne Werk, Bestellposition und Fehlermeldung beim Wareneingang.|Provide the plant, purchase order item and goods receipt error.|Indica divisione, posizione dell’ordine ed errore in entrata merci.|Indica el centro, la posición del pedido y el error en la entrada de mercancías.
Nenne Werk, Prüflos und den Schritt, an dem die Qualitätsprüfung stockt.|Provide the plant, inspection lot and step where inspection stops.|Indica divisione, lotto di controllo e fase in cui il controllo si blocca.|Indica el centro, el lote y el paso donde se bloquea la inspección.
Beschreibe den heutigen Freigabeweg, die gewünschte Regel und ein Abnahmebeispiel.|Describe the current approval flow, desired rule and an acceptance example.|Descrivi il flusso attuale, la regola desiderata e un esempio di accettazione.|Describe el flujo actual, la regla deseada y un ejemplo de aceptación.
Nenne Schnittstelle oder Job, Zeitpunkt und die Auswirkung auf den Geschäftsprozess.|Provide the interface or job, time and business impact.|Indica interfaccia o job, orario e impatto sul processo.|Indica la interfaz o tarea, la hora y el impacto en el proceso.
Ticketdaten und Anhänge|Ticket details and attachments|Dettagli e allegati del ticket|Detalles y adjuntos del ticket
Zusatzinformationen und Auswirkungen|Additional information and impact|Informazioni aggiuntive e impatto|Información adicional e impacto
Geschäftliche Auswirkungen|Business impact|Impatto operativo|Impacto en el negocio
Gewünschtes Ergebnis|Desired outcome|Risultato desiderato|Resultado deseado
Aktueller Ausweichweg|Current workaround|Soluzione temporanea attuale|Solución alternativa actual
Bitte Betreff und eine Beschreibung mit bis zu 3.000 Zeichen eingeben.|Enter a subject and a description of up to 3,000 characters.|Inserisci oggetto e descrizione di massimo 3.000 caratteri.|Introduce un asunto y una descripción de hasta 3.000 caracteres.
Anliegen aktualisiert: {fields}|Request updated: {fields}|Richiesta aggiornata: {fields}|Solicitud actualizada: {fields}
Gemeldete Kritikalität|Reported criticality|Criticità segnalata|Criticidad indicada
Noch nicht bewertet|Not rated yet|Non ancora valutata|Aún sin evaluar
Ticket bearbeiten|Edit ticket|Modifica ticket|Editar ticket
Mit DeepL übersetzen|Translate with DeepL|Traduci con DeepL|Traducir con DeepL
DeepL ist auf diesem Rechner noch nicht eingerichtet.|DeepL has not been configured on this computer.|DeepL non è ancora configurato su questo computer.|DeepL aún no está configurado en este equipo.
DeepL konnte den Text nicht übersetzen.|DeepL could not translate the text.|DeepL non ha potuto tradurre il testo.|DeepL no pudo traducir el texto.
Für diese Person gibt es noch keine eigenen Anliegen.|This person has no requests of their own yet.|Questa persona non ha ancora richieste proprie.|Esta persona aún no tiene solicitudes propias.
Zum IT-Arbeitsplatz und alle Tickets anzeigen|Open IT workspace and show all tickets|Apri l’area IT e mostra tutti i ticket|Abrir el área de TI y ver todos los tickets
Nicht zugewiesen|Unassigned|Non assegnato|Sin asignar
Ändern|Edit|Modifica|Cambiar
Erneut versuchen|Try again|Riprova|Reintentar
Bitte wähle die Originalsprache für die Übersetzung.|Select the original language to translate this ticket.|Seleziona la lingua originale per tradurre il ticket.|Selecciona el idioma original para traducir este ticket.
Alle Ticketinhalte sind bereits auf {language} verfügbar.|All ticket content is already available in {language}.|Tutti i contenuti del ticket sono già disponibili in {language}.|Todo el contenido del ticket ya está disponible en {language}.
Übersicht|Overview|Panoramica|Resumen
Kundendialog|Customer conversation|Conversazione con il cliente|Conversación con el cliente
Interne Notizen|Internal notes|Note interne|Notas internas
Umsetzung|Delivery|Implementazione|Implementación
Betrieb|Operations|Operazioni|Operaciones
Ticketbereiche|Ticket sections|Sezioni del ticket|Secciones del ticket
Noch keine Einträge.|No entries yet.|Nessuna voce.|Aún no hay entradas.
Im Anliegenportal sichtbar|Visible in the request portal|Visibile nel portale delle richieste|Visible en el portal de solicitudes
Nur in der IT-Ansicht sichtbar|Visible in the IT workspace only|Visibile solo nell’area IT|Visible solo en el área de TI
Speichern übernimmt Änderungen aus allen Reitern.|Save applies changes from all tabs.|Il salvataggio applica le modifiche di tutte le schede.|Guardar aplica los cambios de todas las pestañas.
Bitte gib eine Nachricht mit 1 bis 1.200 Zeichen ein.|Enter a message between 1 and 1,200 characters.|Inserisci un messaggio tra 1 e 1.200 caratteri.|Introduce un mensaje de entre 1 y 1200 caracteres.
{file} ist bereits angehängt.|{file} is already attached.|{file} è già allegato.|{file} ya está adjunto.
Keine Datei erkannt. Wähle die Datei über „Dateien auswählen“ aus.|No file detected. Use the file picker to select it.|Nessun file rilevato. Seleziona il file con il pulsante di selezione.|No se detectó ningún archivo. Selecciónalo con el botón de selección.
Änderungen übernehmen|Import changes|Importa modifiche|Importar cambios
Die Arbeitskopie konnte nicht erneut geöffnet werden. Versuche, die gespeicherten Änderungen zu übernehmen.|Could not reopen the working copy. Try importing the saved changes.|Impossibile riaprire la copia di lavoro. Prova a importare le modifiche salvate.|No se pudo volver a abrir la copia de trabajo. Intenta importar los cambios guardados.
Datei in Office speichern und schließen. Danach Änderungen übernehmen.|Save and close the file in Office. Then import changes.|Salva e chiudi il file in Office. Poi importa le modifiche.|Guarda y cierra el archivo en Office. Después importa los cambios.
Datei konnte nicht im Standardprogramm geöffnet werden. Die Kopie kann heruntergeladen werden.|The file could not be opened in the default app. You can download a copy.|Impossibile aprire il file nell'app predefinita. Puoi scaricare una copia.|No se pudo abrir el archivo en la aplicación predeterminada. Puedes descargar una copia.
Die Arbeitskopie enthält noch keine gespeicherten Änderungen.|The working copy has no saved changes yet.|La copia di lavoro non contiene ancora modifiche salvate.|La copia de trabajo aún no contiene cambios guardados.
Die neue Fassung ist bereits zum Speichern vorgemerkt.|The new version is already queued to be saved.|La nuova versione è già in attesa di salvataggio.|La nueva versión ya está pendiente de guardado.
Anhang aktualisiert. Klicke auf Speichern.|Attachment updated. Click Save.|Allegato aggiornato. Fai clic su Salva.|Adjunto actualizado. Haz clic en Guardar.
Arbeitskopie konnte nicht gelesen werden. Speichere und schließe die Datei in Office und versuche es erneut.|The working copy could not be read. Save and close the file in Office and try again.|Impossibile leggere la copia di lavoro. Salva e chiudi il file in Office e riprova.|No se pudo leer la copia de trabajo. Guarda y cierra el archivo en Office y vuelve a intentarlo.
`;
const dictionary = new Map(rows.trim().split("\n").map(row => {
  const [key, en, it, es] = row.split("|");
  return [key, {en, it, es}];
}));
dictionary.set("ERP", {de:"SAP S/4HANA", en:"SAP S/4HANA", it:"SAP S/4HANA", es:"SAP S/4HANA"});
dictionary.set("ERP-Berechtigung", {de:"SAP-Berechtigung beantragen", en:"Request SAP access", it:"Richiedi accesso SAP", es:"Solicitar acceso a SAP"});
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
const escapeUI = value => String(value ?? "").replace(/[&<>"']/g, char =>
  ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
// Keep the message key with rendered interface text. User content is never marked.
export function uiText(key, values = {}, localized = []) {
  const translatedValues = Object.fromEntries(Object.entries(values).map(([name, value]) =>
    [name, localized.includes(name) ? t(value) : value]));
  return '<span data-ui-key="' + escapeUI(key) + '" data-ui-values="' +
    escapeUI(JSON.stringify(values)) + '" data-ui-localized="' + escapeUI(JSON.stringify(localized)) +
    '">' + escapeUI(t(key, translatedValues)) + '</span>';
}
export function labelKey(label) {
  for (const [key, translations] of dictionary) {
    if ((translations[language] ?? key) === label) return key;
  }
  return label;
}
export function localizeUI(root) {
  for (const element of root.querySelectorAll("[data-ui-key]")) {
    const values = JSON.parse(element.dataset.uiValues || "{}");
    const localized = JSON.parse(element.dataset.uiLocalized || "[]");
    element.textContent = t(element.dataset.uiKey, Object.fromEntries(Object.entries(values).map(([name, value]) =>
      [name, localized.includes(name) ? t(value) : value])));
  }
  for (const name of ["aria-label", "placeholder", "title"]) {
    for (const element of root.querySelectorAll('[data-ui-' + name + ']')) {
      element.setAttribute(name, t(element.getAttribute('data-ui-' + name)));
    }
  }
}
// Called only for static interface fragments, before their first localization.
export function markStaticUI(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) nodes.push(node);
  for (const node of nodes) {
    const key = node.nodeValue.trim();
    if (!dictionary.has(key)) continue;
    if (node.parentElement.tagName === "OPTION") node.parentElement.dataset.uiKey = key;
    else {
      const span = document.createElement("span");
      span.dataset.uiKey = key;
      span.textContent = key;
      node.replaceWith(span);
    }
  }
  for (const element of root.querySelectorAll("[aria-label], [placeholder], [title]")) {
    for (const name of ["aria-label", "placeholder", "title"]) {
      const key = element.getAttribute(name);
      if (dictionary.has(key)) element.setAttribute("data-ui-" + name, key);
    }
  }
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














