# LLSG Service Desk

Eigenständiger Web-Prototyp für den internen IT-Service-Desk. Die Beispieltickets sind fiktiv.

## Starten wie beim LLSG-Kanban-Board

Unter Windows die Dateien herunterladen und entpacken oder das Repository klonen. Im Projektordner **TICKETSYSTEM-STARTEN.cmd** doppelklicken. Node.js startet den lokalen Server und öffnet http://127.0.0.1:8092 im Standardbrowser. Die Konsole geöffnet lassen. Strg+C beendet die Vorschau. Es sind keine npm-Pakete erforderlich. Alternativ im Projektordner `node server.mjs` ausführen und die Adresse selbst öffnen.

## Pilotablauf

- Anliegen mit Typ, betroffenem Service und gemeldeter Dringlichkeit erfassen. Die IT-Priorität wird separat gesetzt.
- Die Beschreibung mit dem Rich-Text-Editor aus dem Kanban-Board formatieren.
- Anhänge aus dem Explorer in den Anhangsbereich ziehen oder über die Dateiauswahl hinzufügen. Das Limit beträgt 10 MB je Datei und 40 MB je Ticket.
- Tickets suchen, filtern, einordnen, zuweisen und bearbeiten. Projektübernahme mit eigener Entscheidung und Projektreferenz dokumentieren.
- Änderungen und Notizen im Verlauf nachvollziehen.

Tickets und Anhänge werden im Browserprofil für diese lokale Adresse gespeichert. Ein anderes Browserprofil oder die alte localhost-Adresse hat einen eigenen Datenbestand. Das Repository enthält Anwendungscode und fiktive Beispieltickets. Die Demo verwendet eine gemeinsame Oberfläche ohne Benutzerkonten. S/4HANA ist ein späterer Entwicklungsstrang.

## Sprachen und Kanban

- Die Sprache der Oberfläche lässt sich zwischen Deutsch, Englisch und Italienisch umschalten. Auswahlwerte werden unabhängig von der Anzeige gespeichert.
- Beim Erfassen die Sprache des Originals wählen. Im Ticket lassen sich Betreff und Beschreibung per **Mit KI übersetzen** in einer anderen Sprache anzeigen. Das Original bleibt erhalten. Die Funktion setzt eine unterstützte Desktop-Version von Chrome oder Edge mit lokaler Translator API voraus. Beim ersten Einsatz kann der Browser ein Sprachmodell herunterladen. Der Prototyp sendet Tickettexte an keinen Übersetzungsdienst.
- Unter **Link zur Kanban-Karte** eine Kartenadresse aus der lokalen LLSG-Kanban-Fassung auf Port 8090 oder 8091 einfügen. **Übergabe kopieren** kopiert Ticketnummer, Betreff und Rücklink für die Kanban-Karte. Der Rücklink setzt denselben Ticket-Datenbestand im lokalen Browser voraus.

## Schnellfilter und Serviceabläufe

- Die vier Kennzahlen filtern die Liste per Klick. Ein erneuter Klick auf die aktive Kachel oder **Kachelfilter entfernen** hebt den Filter auf. Suchtext, Typ und Status bleiben erhalten.
- Der Servicekatalog enthält vier Vorlagen für häufige IT-Anliegen. Die Vorlage setzt den Anliegenstyp und Service und zeigt einen passenden Hinweis an.
- Rückfragen, Antworten und interne Notizen werden typisiert im lokalen Verlauf gespeichert. Die Kennzeichnung ersetzt in der Demo keine rollenbasierte Sichtbarkeit.
- Eine Freigabe lässt sich anfragen und anschließend mit Person und Begründung genehmigen oder ablehnen. Entscheidungen werden im Verlauf protokolliert.
- Tickets lassen sich verknüpfen, etwa als Duplikat oder Abhängigkeit. Die Beziehung ist von beiden Tickets aus sichtbar.

## Anliegenportal und IT-Arbeitsplatz

Oben unter **Arbeitsbereich** zwischen Anliegenportal und IT-Arbeitsplatz wechseln. Im Portal die anfragende Person auswählen. Das Portal zeigt ihre Tickets, die Beschreibung, Anhänge und Rückfragen oder Antworten. Im IT-Arbeitsplatz eine Demo-Persona auswählen. Dort sind alle Tickets sowie Bearbeitungsfelder, Freigaben, interne Notizen und Verknüpfungen verfügbar. Der Rollenwechsel dient der Demo. Die lokale Anwendung hat keine Anmeldung und keine serverseitigen Zugriffsrechte.

Die Oberfläche sowie Original- und Zielsprachauswahl unterstützen Deutsch, Englisch, Italienisch und Spanisch. Nach einem Update mit Änderungen am Server den bisherigen Prozess mit Strg+C beenden und die Startdatei erneut öffnen. Die App über http://127.0.0.1:8092 laden.

## Lesesprache und neue Abläufe

Beim Öffnen übernimmt das Ticket die Sprache der Oberfläche. Im Ticket kann man die Lesesprache jederzeit ändern, auch zurück zur Originalsprache. Betreff, Beschreibung, sichtbare Nachrichten und ausgewählte Arbeitstexte werden direkt in der Ansicht übersetzt. **Original anzeigen** stellt die gespeicherten Texte wieder her. Neue Nachrichten speichern ihre eigene Originalsprache. Bei älteren Nachrichten ohne Sprachangabe verwendet die Übersetzung die Originalsprache des Tickets als Anhaltspunkt. Technische Kennungen, Personennamen und editierbare Originalfelder bleiben erhalten. Die Sprachmodelle und ihre Verfügbarkeit hängen vom Desktop-Browser ab.

- Im Anliegenportal einen Screenshot einfügen oder auswählen. Markierungen und Schwärzungen werden beim Übernehmen in eine neue PNG-Datei eingebrannt. Die ursprüngliche Bilddatei wird in diesem Ablauf nicht angehängt.
- Im IT-Arbeitsplatz einen Funktionstest anfordern. Im Portal mit **Funktioniert** oder **Fehler besteht noch** antworten. Bei einem Fehlschlag wird eine Beschreibung verlangt. Die Antwort erscheint in der IT-Warteschlange.
- Eine Störung mit einem öffentlichen Titel als Sammelstörung veröffentlichen. Bei einer neuen Störung für denselben Service können sich Anfragende als betroffen melden und veröffentlichte Statusmeldungen in ihrem Ticket sehen.
- Für einen genehmigten Change einen Kanban-Entwurf vorbereiten, prüfen und kopieren. Die Karte im Board anlegen und den Kartenlink im Ticket speichern. Danach die Abnahme im Ticket anfordern. Das Board sperrt Schreibzugriffe von anderen lokalen Ursprüngen.
- Im IT-Arbeitsplatz einen Diagnoseentwurf oder eine Schichtübergabe öffnen. Bei einem Screenshot und einem kompatiblen Browser kann die lokale KI einen zusätzlichen Diagnoseentwurf erzeugen. Die Schichtübergabe verlinkt auf die jeweiligen Verlaufseinträge.
