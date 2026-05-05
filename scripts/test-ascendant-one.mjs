import {
  Observer,
  RotateVector,
  Rotation_HOR_ECL,
  SphereFromVector,
  VectorFromHorizon,
} from "astronomy-engine";

function normalizeAngle(value) {
  return ((value % 360) + 360) % 360;
}

function getAyanamsaLinear(dateUtc) {
  const J2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
  const days = (dateUtc.getTime() - J2000) / 86400000;
  const years = days / 365.25;
  return 23.852997 + (years * 50.288) / 3600;
}

function getAscendant(dateUtc, lat, lon, refraction) {
  const observer = new Observer(lat, lon, 0);
  const horToEcl = Rotation_HOR_ECL(dateUtc, observer);
  const eastHorizonVector = VectorFromHorizon({ lat: 0, lon: 90, dist: 1 }, dateUtc, refraction);
  const eclVector = RotateVector(horToEcl, eastHorizonVector);
  const eclSphere = SphereFromVector(eclVector);
  return normalizeAngle(normalizeAngle(eclSphere.lon) - getAyanamsaLinear(dateUtc));
}

const coords = { lat: 8.4304, lon: 99.9631 }; // Nakhon Si Thammarat
/** Local 22:42 Thailand (UTC+7) → UTC instant */
const birthUtc = new Date(Date.UTC(1986, 8, 17, 22 - 7, 42));
const lonEmpty = getAscendant(birthUtc, coords.lat, coords.lon, "");
const lonNormal = getAscendant(birthUtc, coords.lat, coords.lon, "normal");
const observer = new Observer(coords.lat, coords.lon, 0);
const horToEcl = Rotation_HOR_ECL(birthUtc, observer);
const eastVec = VectorFromHorizon({ lat: 0, lon: 90, dist: 1 }, birthUtc, "normal");
const eclNoAy = SphereFromVector(RotateVector(horToEcl, eastVec));
const tropical = normalizeAngle(eclNoAy.lon);
console.log({ birthUtc: birthUtc.toISOString(), siderealEmpty: lonEmpty, siderealNormal: lonNormal, tropical });

const SIGNS_TH = ["เมษ", "พฤษภ", "เมถุน", "กรกฎ", "สิงห์", "กันย์", "ตุลย์", "พิจิก", "ธนู", "มังกร", "กุมภ์", "มีน"];
console.log("tropical sign:", SIGNS_TH[Math.floor(tropical / 30) % 12], tropical);

for (const r of ["", "normal"]) {
  const v = getAscendant(birthUtc, coords.lat, coords.lon, r);
  console.log(`ref=${JSON.stringify(r) || "normal"} → ${SIGNS_TH[Math.floor(v / 30)]} (${v})`);
}

// Bangkok coords for contrast
const bkk = { lat: 13.7563, lon: 100.5018 };
const vBangkok = getAscendant(birthUtc, bkk.lat, bkk.lon, "normal");
console.log("if Bangkok:", SIGNS_TH[Math.floor(vBangkok / 30)], vBangkok);
