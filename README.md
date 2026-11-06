# LLSG Service Desk

Eigenständiger Web-Prototyp für einen internen IT-Service-Desk. Die LLSG ist die Beispielorganisation, alle Tickets sind fiktiv.

## Lokal öffnen

Die Datei index.html im Browser öffnen. Für einen lokalen HTTP-Start im Projektordner `python -m http.server 8000` ausführen und http://localhost:8000 öffnen.

## Pilotablauf

- Anliegen erfassen und in der Ticketübersicht finden.
- Ticket als Störung, Serviceanfrage, Änderungsantrag oder neues Vorhaben einordnen.
- Priorität, Bearbeitungsstatus und Zuständigkeit setzen.
- Einen Änderungsantrag zur Projektprüfung geben. Bei der Übernahme die Projektreferenz erfassen. Der Anliegenstyp bleibt erhalten.
- Änderungen und Notizen im Verlauf nachvollziehen.

Der Prototyp speichert Änderungen im lokalen Browserspeicher. Er verwendet eine gemeinsame Demo-Ansicht ohne Benutzerkonten, Rollen oder geteilten Datenbestand. Die Übertragung auf S/4HANA ist ein späterer Entwicklungsstrang.
