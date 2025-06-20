```json
{
  "id": "4",
  "benutzer_id": "806",
  "modul_id": "1.2",
  "modul_titel": "Einführung in die Wissenschaft der Sozialen Arbeit",
  "lv_id": "3",
  "lv_titel": "Geschichte der Sozialen Arbeit",
  "lv_frei_titel": null,
  "block_titel": null,
  "start_datum": "2024-04-27",
  "wochentag": "0",
  "anfangszeit": "08:00",
  "dauer": "90",
  "dozent": "Testsw, Dozent",
  "rhythmus": "W",
  "co_dozent": null,
  "max_tn": null,
  "warteliste_len": null,
  "raum_wunsch": null,
  "vformat": "Präsenz",
  "anmerkung": null,
  "status": "geplant"
},

```

```json
{
  "id": "9",
  "termin_name": " 1.2 Geschichte der Sozialen Arbeit",
  "wunschtermin_id": "4",
  "raum": "BL.316",
  "anfangszeit": "08:00",
  "dauer": "90",
  "status": "geplant",
  "wochentag": "0",
  "rhythmus": "W",
  "start_datum": "2024-04-27",
  "semesterhaelfte": "0",
  "benutzer_id": "806",
  "wunschtermin": {
    "id": "4",
    "benutzer_id": "806",
    "modul_id": "1.2",
    "modul_titel": "Einführung in die Wissenschaft der Sozialen Arbeit",
    "lv_id": "3",
    "lv_titel": "Geschichte der Sozialen Arbeit",
    "lv_frei_titel": null,
    "block_titel": null,
    "start_datum": "2024-04-27",
    "wochentag": "0",
    "anfangszeit": "08:00",
    "dauer": "90",
    "dozent": "Testsw, Dozent",
    "rhythmus": "W",
    "co_dozent": null,
    "max_tn": null,
    "warteliste_len": null,
    "raum_wunsch": null,
    "vformat": "Präsenz",
    "anmerkung": null,
    "status": "geplant"
  }
}

{
  "id": "string",
  "termin_name": "string",
  "wunschtermin_id": "string",
  "raum": "string",
  "anfangszeit": "string",
  "dauer": "string",
  "status": "string",
  "wochentag": "string",
  "rhythmus": "string",
  "start_datum": "string",
  "semesterhaelfte": "string",
  "benutzer_id": "string",
  "vformat": "string"
}
```

```pseudo
Function checkSwExtApptKonflikt(semestername, body):
    newStart = convertToMinutes(body.anfangszeit)
    newDuration = parseInt(body.dauer)
    newEnd = newStart + newDuration
    newRhythmus = body.rhythmus

    // Get alle Termine von Externe
    apptList = getAllAppointmentsforRoom(semestername, body.raum)
    wochentag = body.wochentag

    If newRhythmus == "BK":
        wochentag = weekdayFromDate(body.startDatum)

    If apptList is not empty:
        sameDayAppts = filter appointments where appt.wochentag == wochentag

        For each appt in sameDayAppts:
            apptStart = convertToMinutes(appt.anfangszeit)
            apptEnd = apptStart + parseInt(appt.dauer)
            gu = appt.gu

            If newRhythmus == "W" or newRhythmus == "VZ2":
                If timesOverlap(newStart, newEnd, apptStart, apptEnd):
                    return true

            If newRhythmus == "VZ":
                If startDatum is missing:
                    return true
                evenWeek = isEvenWeek(body.startDatum)
                If (gu contains "G" and evenWeek) or (gu contains "U" and not evenWeek):
                    If timesOverlap(newStart, newEnd, apptStart, apptEnd):
                        return true

            If newRhythmus == "BK":
                If startDatum is missing:
                    throw error
                evenWeek = isEvenWeek(body.startDatum)
                If gu contains "N":
                    If timesOverlap(newStart, newEnd, apptStart, apptEnd):
                        return true
                If (gu contains "G" and evenWeek) or (gu contains "U" and not evenWeek):
                    If timesOverlap(newStart, newEnd, apptStart, apptEnd):
                        return true

    return false
```

my-vite-app
├── index.html
├── package.json
├── vite.config.js
├── node_modules
├── public
├── src
│ ├── App.jsx
│ ├── main.jsx
│ ├── assets
│ │ └── react.svg
│ └── index.css
└── .gitignore
