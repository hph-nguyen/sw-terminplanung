import * as httpRequest from "./httpRequest";

export const checkSemesterSlash = (semester) => {
  return semester.replace("/", "");
};

const getUserData = () => {
  try {
    if (sessionStorage.getItem("user")) {
      const temp = JSON.parse(sessionStorage.getItem("user"));
      return {
        uid: temp.uid,
        password: temp.password,
      };
    } else return {};
  } catch (error) {
    console.error("Failed to parse user auth data", error);
    return {};
  }
};

export const getSemesterListe = async () => {
  try {
    const res = await httpRequest.get("/semesterliste");
    return res;
  } catch (error) {
    return error;
  }
};

export const getUser = async (uid) => {
  try {
    const res = await httpRequest.get(`/swbenutzer?Benutzerlogin=${uid}`);
    return res;
  } catch (err) {
    return err;
  }
};

export const getModulListe = async (semester) => {
  try {
    const res = await httpRequest.get(`${checkSemesterSlash(semester)}/swmodulListe`);
    return res;
  } catch (err) {
    return err;
  }
};

export const getLvListe = async (semester) => {
  try {
    const res = await httpRequest.get(`${checkSemesterSlash(semester)}/swlvListe`);
    return res;
  } catch (err) {
    return err;
  }
};

export const getAllWunschtermine = async (semester) => {
  try {
    const res = await httpRequest.get(`${checkSemesterSlash(semester)}/swWunschtermine`);
    return res;
  } catch (err) {
    return err;
  }
};

export const getFeiertage = async (semester) => {
  try {
    const res = await httpRequest.get(`${checkSemesterSlash(semester)}/feiertage`);
    return res;
  } catch (error) {
    return error;
  }
};

/**
 * WITH BASIC-AUTH
 */
export const postNewModul = async (semester, body) => {
  try {
    const res = await httpRequest.post(
      `${checkSemesterSlash(semester)}/swmodul`,
      body,
      httpRequest.basicAuthen(getUserData())
    );
    return res;
  } catch (e) {
    return e;
  }
};

export const deleteModul = async (semester, body) => {
  try {
    const res = await httpRequest.post(
      `${checkSemesterSlash(semester)}/swmodul/delete`,
      body,
      httpRequest.basicAuthen(getUserData())
    );
    return res;
  } catch (e) {
    return e;
  }
};

export const deleteLv = async (semester, body) => {
  try {
    const res = await httpRequest.post(
      `${checkSemesterSlash(semester)}/swlv/delete`,
      body,
      httpRequest.basicAuthen(getUserData())
    );
    return res;
  } catch (e) {
    return e;
  }
};

export const postNewLv = async (semester, body) => {
  try {
    const res = await httpRequest.post(
      `${checkSemesterSlash(semester)}/swlv`,
      body,
      httpRequest.basicAuthen(getUserData())
    );
    return res;
  } catch (e) {
    return e;
  }
};

export const putEditLv = async (semester, body) => {
  try {
    const res = await httpRequest.put(
      `${checkSemesterSlash(semester)}/swlv`,
      body,
      httpRequest.basicAuthen(getUserData())
    );
    return res;
  } catch (e) {
    return e;
  }
};

export const putEditModul = async (semester, body) => {
  try {
    const res = await httpRequest.put(
      `${checkSemesterSlash(semester)}/swmodul`,
      body,
      httpRequest.basicAuthen(getUserData())
    );
    return res;
  } catch (e) {
    return e;
  }
};

export const getZugangscode = async (semester) => {
  try {
    const res = await httpRequest.get(
      `${checkSemesterSlash(semester)}/zugangscode`,
      httpRequest.basicAuthen(getUserData())
    );
    return res;
  } catch (e) {
    return e;
  }
};

export const deleteZugangscode = async (semester, body) => {
  try {
    const res = await httpRequest.post(
      `${checkSemesterSlash(semester)}/zugangscode/delete`,
      body,
      httpRequest.basicAuthen(getUserData())
    );
    return res;
  } catch (e) {
    return e;
  }
};

export const putWunschTermin = async (semester, termin, benutzerId) => {
  try {
    const res = await httpRequest.put(`${checkSemesterSlash(semester)}/swWunschtermine/${benutzerId}`, termin);
    return res;
  } catch (err) {
    return err;
  }
};

export const addZugangscode = async (semester, body) => {
  try {
    const res = await httpRequest.post(
      `${checkSemesterSlash(semester)}/zugangscode`,
      body,
      httpRequest.basicAuthen(getUserData())
    );
    return res;
  } catch (e) {
    return e;
  }
};

export const swLogin = async (semester, user) => {
  try {
    const res = await httpRequest.post(`${checkSemesterSlash(semester)}/swlogin`, "", httpRequest.basicAuthen(user));
    return res;
  } catch (e) {
    return e;
  }
};

export const getRoomsList = async (semester, fakultaet) => {
  try {
    const res = await httpRequest.get(
      `${checkSemesterSlash(semester)}/rooms/fakultaet/${fakultaet}`,
      httpRequest.basicAuthen(getUserData())
    );
    return res;
  } catch (e) {
    return e;
  }
};

export const getAllGeplanteTermine = async (semester) => {
  try {
    const res = await httpRequest.get(`${checkSemesterSlash(semester)}/swAppt`, httpRequest.basicAuthen(getUserData()));
    return res;
  } catch (e) {
    return e;
  }
};

export const getSemesterAnfangUndEnde = async (semester) => {
  try {
    const res = await httpRequest.get(
      `${checkSemesterSlash(semester)}/AnfangUndEnde`,
      httpRequest.basicAuthen(getUserData())
    );
    return res;
  } catch (e) {
    return e;
  }
};

export const postNeuenTermin = async (semester, body) => {
  try {
    const res = await httpRequest.post(
      `${checkSemesterSlash(semester)}/swAppt`,
      body,
      httpRequest.basicAuthen(getUserData())
    );
    return res;
  } catch (e) {
    return e;
  }
};

export const putTermin = async (semester, body) => {
  try {
    const res = await httpRequest.put(
      `${checkSemesterSlash(semester)}/swAppt`,
      body,
      httpRequest.basicAuthen(getUserData())
    );
    return res;
  } catch (e) {
    return e;
  }
};

export const deleteTermin = async (semester, body) => {
  try {
    const res = await httpRequest.post(
      `${checkSemesterSlash(semester)}/swAppt/delete`,
      body,
      httpRequest.basicAuthen(getUserData())
    );
    return res;
  } catch (e) {
    return e;
  }
};

export const getAllBenutzer = async (semester) => {
  try {
    const res = await httpRequest.get(
      `${checkSemesterSlash(semester)}/benutzer?Namensfilter`,
      httpRequest.basicAuthen(getUserData())
    );
    return res;
  } catch (e) {
    return e;
  }
};

export const addDozent = async (semester, data) => {
  try {
    const res = await httpRequest.post(
      `${checkSemesterSlash(semester)}/benutzer`,
      data,
      httpRequest.basicAuthen(getUserData())
    );
    return res;
  } catch (e) {
    return e;
  }
};

export const editDozent = async (semester, data, namensFilter) => {
  try {
    const res = await httpRequest.put(`${checkSemesterSlash(semester)}/benutzer`, data, {
      ...httpRequest.basicAuthen(getUserData()),
      params: {
        Namensfilter: namensFilter,
      },
    });
    return res;
  } catch (e) {
    return e;
  }
};

/**
 *
 * @param {*} semester
 * @param {*} data
 * @returns
 */
export const getSemesterhaelfte = async (semester) => {
  try {
    const response = await httpRequest.post(
      `${semester}/semesterhaelfte`,
      apptSchema,
      httpRequest.basicAuthen(getUserData())
    );
    return response;
  } catch (error) {
    return error;
  }
};

/**
 * Für graphische Stellung von SH1 & SH2 Termine ist nur die ISODatum von endSH1 benötigt.
 * Diese Datum kann man mit alle Termine durch Request gleiche Werte bekommen.
 * Um die Anzahl unnötiger Request an den Server zu minimieren.
 * Beim Laden der Seite oder Semesterwechseln wird nur ein Request mit Const.ApptSchema gesendet.
 * Dieses Schema folgt dem externen Appt
 */
const apptSchema = [
  {
    wochentag: "",
    anfangszeit: "",
    gebuchtvon: "",
    datum: "-",
    dauer: "",
    gu: "N",
    semesterhaelfte: "0",
    fakultaet: "",
    semestername: sessionStorage.getItem("semesterName") || "",
    turnus: "",
    name: "",
    dozent: "-",
    kommentar: "",
  },
];
