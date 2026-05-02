const { Observer, Rotation_ECL_HOR, VectorFromSphere, HorizonFromVector, RotateVector } = require('astronomy-engine');
const observer = new Observer(8.432, 99.968, 0);

function findAscendant(dateUtc) {
  const eclToHor = Rotation_ECL_HOR(dateUtc, observer);
  for (let lon = 0; lon < 360; lon += 0.1) {
    const ecl = { lat: 0, lon, dist: 1 };
    const v = VectorFromSphere(ecl, dateUtc);
    const hor = HorizonFromVector(RotateVector(eclToHor, v), "");
    if (hor.lat > -0.1 && hor.lat < 0.1) {
      return lon;
    }
  }
  return null;
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

// Test a wider range
for (const h of [12, 13, 14, 15, 16, 17, 18]) {
  const dateUtc = new Date(Date.UTC(1986, 8, 17, h, 42));
  const asc = findAscendant(dateUtc);
  if (asc !== null) {
    const ay = getAyanamsa(dateUtc);
    const sidereal = norm(asc - ay);
    const sign = Math.floor(sidereal / 30);
    console.log(`UTC ${h}:42 -> asc ${asc.toFixed(2)} sign ${sign} ${THAI_BIRTH_SIGNS[sign]}`);
  }
}
