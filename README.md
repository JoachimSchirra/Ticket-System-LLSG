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
