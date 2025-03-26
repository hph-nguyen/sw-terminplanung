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

export const getAllGebuchteTermine = async (semester) => {
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

export const putTermin = async (semester, termin, benutzerId) => {
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
