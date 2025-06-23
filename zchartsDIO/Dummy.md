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

```js
import { BrowserRouter } from "react-router";

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

import { createBrowserRouter, RouterProvider } from "react-router";
const router = createBrowserRouter([{ path: "/", Component: Root, loader: loadRootData }]);
<RouterProvider router={router} />;

import { index, route } from "@react-router/dev/routes";
export default [index("./home.tsx"), route("products/:pid", "./product.tsx")];

const httpRequest = axios.create({
  baseURL: "http://localhost:8080",
});

export const get = async (path, options = {}) => {
  const response = await httpRequest.get(path, options);
  return response;
};

export const post = async (path, data, options = {}) => {
  const response = (await httpRequest.post) / put(path, data, options);
  return response;
};
```

1. Berechne neue Startzeit, Endzeit, Dauer, Rhythmus und Wochentag des neuen Termins
2. Wenn Rhythmus == "BK", bestimme Wochentag anhand Startdatum
3. Hole bestehende Termine im Raum für das Semester
4. Alle Termine am selben Wochentag basiert auf Raumname in Datenbank abfragen
5. Für jeden bestehenden Termin:
   a. Berechne Start- und Endzeit
   b. Wenn Rhythmus ist W oder VZ2: - Prüfe auf Zeitkollision
   c. Wenn Rhythmus ist VZ: - Prüfe auf gültiges Datum - Bestimme ob gerade oder ungerade Woche - Prüfe GU-Wert von Externe Termin und passende Woche auf Zeitkollision
   d. Wenn Rhythmus ist BK: - Prüfe auf gültiges Datum - Prüfe GU-Wert von Externe Termin und passende Woche auf Zeitkollision
6. Wenn Kollision gefunden  return true
7. Sonst -> return false

```
1. Berechne neue Startzeit, Endzeit, Dauer, Rhythmus und Wochentag des neuen Termins
2. Wenn Rhythmus == "BK", bestimme Wochentag anhand Startdatum
3. Erstelle WHERE-Bedingung je nachdem ob Raum oder Dozent geprüft wird
4. Lade Termine aus DB nach Filter
5. Wenn Liste leer  return false
6. Für jeden bestehenden Termin:
   a. Überspringe Termin mit gleicher ID (bei Update mit PUT)
   b. Berechne Start-/Endzeit, Rhythmus, Wochentag
   c. Prüfe Rhythmus-Fälle:
      - "W" oder "VZ2":
        * Falls DB-Termin "BK", gleiche Wochentag nötig
        * Prüfe auf Zeitkollision
      - "BK":
        * Prüfe Startdatum
        * Vergleiche mit Terminen je nach Rhythmus ("BK", "W", "VZ") und Woche
  * Prüfe auf Zeitkollision
      - "VZ":
        * Vergleiche Woche bei "VZ" und "BK" Terminen
        * Prüfe auf Zeitkollision
7. Wenn Kollision gefunden, return true
8. Sonst return false
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
    …
  }
}

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
}

{
    "modul_id": "5.3",
    "modul_titel": "Test",
    "lectures": [
        "Neu Lv"
    ]
}

{
    "id": "bab13cb8-bcc5-56f6-a91a-cb2f496f2ae9",
    "module": "5.3 Test",
    "lv_titel": "Neu Lv",
    "block_titel": "Prüfungsvorbereitung",
    "rhythmus": "BK",
    "vformat": "Präsenz",
    "lv_termin": "20.06.2024, 14:00-15:30",
    "start_datum": "",
    "raum_wunsch": "",
    "co_dozent": "",
    "max_tn": "",
    "warteliste_len": "",
    "anmerkung": "",
    "rawData": {
     // von API abgerufte Wunschtermin Obj.
    }
}

```

```txt
https://editor.plantuml.com/uml/VP11JiGm34NtFaKkC5T0mw0HUwOIQvDQRLN7YL87WL3lJcafLKAWgyhlEVB_vqanQd8CqpX8m8ZEME-25nAzwJkJYMGLfMC2-26ceUWMdr6ITEO3pF8Tz3d9P7jT7IhOpVRK9gRlfHm-4Lgz3Dq3CacByP0AyJu4lRwIw1_ymjwEFlthND_qzpDpvQf7-Wggj8Lky8MO2JPx1iYxE9tkylmLldS0-yywBSFdj7v4kREgHwegphgfArarvsMU77y2

@startuml
skinparam componentStyle rectangle

package Terminplanung {
    [Terminplanung.jsx]
    [Wunschtermine.jsx]
    [Schedule.jsx]
    [BuchTerminForm.jsx]
    [AlertSnackBar]

    Terminplanung.jsx --> Wunschtermine.jsx
    Terminplanung.jsx --> Schedule.jsx
    Wunschtermine.jsx --> BuchTerminForm.jsx


    note right of AlertSnackBar
        Http-Satus Msg:
        - green: OK
        - red: Error
        - yellow: Warning
    end note

    package Schedule {
        [GeplanteTerminTabelle.jsx]
        [ReactBigCalendar]
        [EditTerminForm.jsx]

        Schedule.jsx --> GeplanteTerminTabelle.jsx
        Schedule.jsx --> ReactBigCalendar
        GeplanteTerminTabelle.jsx --> EditTerminForm.jsx

        note right of ReactBigCalendar
            props:
              - components
              - events
              - views
        end note

        package "props: events" {
            [ApptEvent.jsx]
            [ExtApptEvent.jsx]
            [BlockoutEvent.jsx]
        }

        package "props: views" {
            [CustomWeekView.jsx]
        }

        package "Event Handling" {
            [EventPopover.jsx]
            [EditTerminForm.jsx]
        }

        ReactBigCalendar --> ApptEvent.jsx : events
        ReactBigCalendar --> ExtApptEvent.jsx : events
        ReactBigCalendar --> BlockoutEvent.jsx : events


        ReactBigCalendar --> CustomWeekView.jsx : views
        ApptEvent.jsx --> EventPopover.jsx

        EventPopover.jsx --> EditTerminForm.jsx
        EditTerminForm.jsx--> AlertSnackBar

    }
}
@enduml

```

[![](https://img.plantuml.biz/plantuml/svg/ZLLDJ-Cm4Br7odyOSU_-W1nMK5H0MY7G5cqFAmxUP4X37Jko9mM4-E_hZ4dZn6aXggfatdoyUSzfpoq9GsqjqyJkAjK88sh8TTreXOhMz2OH3EOaL2anJTAa4VbEb0WFQ6gNBuLgLGdlQGBk-ZkA_dYshu-VmAPLDjyImnW2wtoBHIj7iMMRRtsdAstg4BcGQ6Yj78UbC8yTdouSJON5uYT48qybXpHyNbJEUJ4rd-s_-yi_AKrElAhS4kWd654Vqc-8ciLQK6lXrfRP02oWD8WgWxjVOT1WaS7A66t2w1jAgLyos0YZAbLw25N177gPUklwNNlNMDbhx2GXzCizY7-kOsWA9_r6aTEoAY-5TCtPWGEsAYgAJ1lmK61MykZ04pNJ-KFgqMvS5tCRAeUxiL_7Px6MHZSs6ySw8mwlZeqntC_7znM-1E6fRQ5rPtxkPwkpq44suQ9fQDLX4-UyGwzq4bzAdUzqEvlmSOeDBn2JkMmjwNg3kFlZ4hxLa4V3ZL25TCSuRidulMxq7itiYdE7S7Rar5u-9oDv88iScosQolhTkaZkcS8l6SSQGpOzK6DsJ7aYOpXcYdtv0iKOInd-t1tsS1QupxdZptyvQV8V)](https://editor.plantuml.com/uml/ZLLDJ-Cm4Br7odyOSU_-W1nMK5H0MY7G5cqFAmxUP4X37Jko9mM4-E_hZ4dZn6aXggfatdoyUSzfpoq9GsqjqyJkAjK88sh8TTreXOhMz2OH3EOaL2anJTAa4VbEb0WFQ6gNBuLgLGdlQGBk-ZkA_dYshu-VmAPLDjyImnW2wtoBHIj7iMMRRtsdAstg4BcGQ6Yj78UbC8yTdouSJON5uYT48qybXpHyNbJEUJ4rd-s_-yi_AKrElAhS4kWd654Vqc-8ciLQK6lXrfRP02oWD8WgWxjVOT1WaS7A66t2w1jAgLyos0YZAbLw25N177gPUklwNNlNMDbhx2GXzCizY7-kOsWA9_r6aTEoAY-5TCtPWGEsAYgAJ1lmK61MykZ04pNJ-KFgqMvS5tCRAeUxiL_7Px6MHZSs6ySw8mwlZeqntC_7znM-1E6fRQ5rPtxkPwkpq44suQ9fQDLX4-UyGwzq4bzAdUzqEvlmSOeDBn2JkMmjwNg3kFlZ4hxLa4V3ZL25TCSuRidulMxq7itiYdE7S7Rar5u-9oDv88iScosQolhTkaZkcS8l6SSQGpOzK6DsJ7aYOpXcYdtv0iKOInd-t1tsS1QupxdZptyvQV8V)
