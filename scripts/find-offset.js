const { Observer, Rotation_ECL_HOR, VectorFromSphere, HorizonFromVector, RotateVector } = require('astronomy-engine');
const observer = new Observer(8.432, 99.968, 0);

function findAscendant(dateUtc) {
  const eclToHor = Rotation_ECL_HOR(dateUtc, observer);
  let bestLon = null;
  let bestAlt = 999;
  for (let lon = 0; lon < 360; lon += 0.1) {
    const ecl = { lat: 0, lon, dist: 1 };
    const v = VectorFromSphere(ecl, dateUtc);
    const hor = HorizonFromVector(RotateVector(eclToHor, v), "");
    if (Math.abs(hor.lat) < Math.abs(bestAlt)) {
      bestAlt = hor.lat;
      bestLon = lon;
    }
  }
  return bestLon;
}

function getAyanamsa(dateUtc) {
  const reference = Date.UTC(2000, 0, 1, 12, 0, 0);
  const daysSinceReference = (dateUtc.getTime() - reference) / 86400000;
  const yearsSinceReference = daysSinceReference / 365.25;
  const degreesPerYear = 50.26 / 3600 / 365.25;
  return 23.855 + yearsSinceReference * degreesPerYear;
}

function norm(a) {
  return ((a % 360) + 360) % 360;
}

const THAI_BIRTH_SIGNS = ["เมษ", "พฤษภ", "เมถุน", "กรกฎ", "สิงห์", "กันย์", "ตุลย์", "พิจิก", "ธนู", "มังกร", "กุมภ์", "มีน"];

// Test more precisely
for (const offset of [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]) {
  const utcHour = 22.7 - offset;  // 22:42 local time
  const dateUtc = new Date(Date.UTC(1986, 8, 17, utcHour));
  const asc = findAscendant(dateUtc);
  if (asc !== null) {
    const ay = getAyanamsa(dateUtc);
    const sidereal = norm(asc - ay);
    const sign = Math.floor(sidereal / 30);
    console.log(`offset UTC+${offset} -> asc ${asc.toFixed(2)} sign ${sign} ${THAI_BIRTH_SIGNS[sign]}`);
  }
}
