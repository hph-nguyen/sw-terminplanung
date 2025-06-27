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

```
my-app
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
```

````js
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
    [AlertSnackBar.jsx]

    Terminplanung.jsx --> Wunschtermine.jsx
    Terminplanung.jsx --> Schedule.jsx
    Wunschtermine.jsx --> BuchTerminForm.jsx


    note right of AlertSnackBar.jsx
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
            Inline component.
            Props:
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
        EditTerminForm.jsx--> AlertSnackBar.jsx

    }
}
@enduml


```

[![](https://img.plantuml.biz/plantuml/svg/ZLNBRjim4BmBq3yiSdS-G8SYSU0sHH4ag8FwKFJ0IXjQDKKIvCf9KFJVIvDMH96o4y8mx9rzpCvGzfKbPgZlH5dONIirCwo3MdLQIPIqfbU1OB0c9hd0iYWBpUeTumYFQ3gNBvZi9OU_PG7k_9n4B__Obrz7ODDBMs_9mnW3wtgBJIyciMLVRqEdpyfqCN8jqD1QEWvBPev0WBB9i5XyWcpikUIOIiZBodrUJYzaX_VXX6zIaHEmvLi2zGGP_R7abaWlrenw2tUMLoEm06uGPGNtt-AWmQQ2bJ7AnD5N548zLx1XHhQI1mXbutaCKWqM3liExdc5l-115iAmu2FxxJh6vlYaxyXgMhRyXWdNd9aOMpKjPUQDU2ooL_Fam3CrwVmnzMGtNvTp6ol7JrFFJiywdAzIkAinFZ6NoIruC4hRQXex6FLMO7CCz_FnVOlFKJYrDRRsGlkvnrONiSFUf6kjQNN04cU3Wozq5byALUzKFvlmxnmRlq1EvgQtfBeDukw7I_XGGpyQRfbidFmyR-dn1wNL7itiYdENT7PaQh-_HnDveCeScorAPVreNIRtJE6xZ7EDeKelr9ITfvp868z9iNSVi1ppKgO_YM-xE1lSwyhjuF-Uok8_)](https://editor.plantuml.com/uml/ZLNBRjim4BmBq3yiSdS-G8SYSU0sHH4ag8FwKFJ0IXjQDKKIvCf9KFJVIvDMH96o4y8mx9rzpCvGzfKbPgZlH5dONIirCwo3MdLQIPIqfbU1OB0c9hd0iYWBpUeTumYFQ3gNBvZi9OU_PG7k_9n4B__Obrz7ODDBMs_9mnW3wtgBJIyciMLVRqEdpyfqCN8jqD1QEWvBPev0WBB9i5XyWcpikUIOIiZBodrUJYzaX_VXX6zIaHEmvLi2zGGP_R7abaWlrenw2tUMLoEm06uGPGNtt-AWmQQ2bJ7AnD5N548zLx1XHhQI1mXbutaCKWqM3liExdc5l-115iAmu2FxxJh6vlYaxyXgMhRyXWdNd9aOMpKjPUQDU2ooL_Fam3CrwVmnzMGtNvTp6ol7JrFFJiywdAzIkAinFZ6NoIruC4hRQXex6FLMO7CCz_FnVOlFKJYrDRRsGlkvnrONiSFUf6kjQNN04cU3Wozq5byALUzKFvlmxnmRlq1EvgQtfBeDukw7I_XGGpyQRfbidFmyR-dn1wNL7itiYdENT7PaQh-_HnDveCeScorAPVreNIRtJE6xZ7EDeKelr9ITfvp868z9iNSVi1ppKgO_YM-xE1lSwyhjuF-Uok8_)

```


````

```json
{
  "start": "2024-03-19T07:45:00.000Z",
  "end": "2024-03-19T11:15:00.000Z",
  "data": {
    "appointment": {
      "id": "2",
      "color": "blue",
      "time": "08:45 - 12:15",
      "details": "1.3 OTIS\nTestsw, Dozent",
      "rhythmus": "W"
    }
  },
  "isDraggable": false,
  "resourceId": "BB.006",
  "rawData": {
    "id": "2",
    "termin_name": "1.3 OTIS",
    "wunschtermin_id": "16",
    "raum": "BB.006",
    "anfangszeit": "08:45",
    "dauer": "210",
    "status": "geplant",
    "wochentag": "1",
    "rhythmus": "W",
    "start_datum": null,
    "semesterhaelfte": "0",
    "benutzer_id": "806",
    "wunschtermin": {
      // ...
    }
  },
  "zusatzInfo": ""
}
```

```js
[
  {
    modul_id: "5.3",
    modul_titel: "Test",
    lectures: ["Neu Lv"],
  },
  ...
];
```

```js
import { RRule } from "rrule";

const rule = new RRule({
  freq: RRule.WEEKLY,
  interval: 1,
  byweekday: [RRule.MO, RRule.WE],
  dtstart: new Date(2025, 5, 24, 10, 0),
  count: 10,
});

const termine = rule.all();
```
