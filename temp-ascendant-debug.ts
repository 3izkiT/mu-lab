import {
  Observer,
  RotateVector,
  Rotation_ECL_HOR,
  Rotation_HOR_ECL,
  VectorFromSphere,
  VectorFromHorizon,
  SphereFromVector,
  HorizonFromVector,
} from 'astronomy-engine';

const observer = new Observer(8.432, 99.968, 0);

function normalizeAngle(value: number) {
  return (((value % 360) + 360) % 360);
}

function debugForUtc(year: number, month: number, day: number, hour: number, minute: number) {
  const dateUtc = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const eclToHor = Rotation_ECL_HOR(dateUtc, observer);

  function horizonCoords(eclLon: number) {
    const eclSphere = { lat: 0, lon: normalizeAngle(eclLon), dist: 1 };
    const eclVector = VectorFromSphere(eclSphere, dateUtc);
    const horVector = RotateVector(eclToHor, eclVector);
    return HorizonFromVector(horVector, "");
  }

  let rootLon: number | null = null;
  for (let lon = 0; lon <= 360; lon += 0.5) {
    const h = horizonCoords(lon);
    if (Math.abs(h.lat) < 0.05) {
      rootLon = lon;
      break;
    }
  }

  const direct = VectorFromHorizon({ lat: 0, lon: 90, dist: 1 }, dateUtc, "");
  const horToEcl = Rotation_HOR_ECL(dateUtc, observer);
  const eclVector = RotateVector(horToEcl, direct);
  const sphere = SphereFromVector(eclVector);

  console.log(`UTC ${dateUtc.toISOString()}`);
  console.log('direct rising ecl lon', normalizeAngle(sphere.lon), 'lat', sphere.lat);
  console.log('approx root lon', rootLon);
  if (rootLon !== null) {
    const h = horizonCoords(rootLon);
    console.log('root alt', h.lat, 'az', h.lon);
  }
  console.log('---');
}

debugForUtc(1986, 9, 17, 15, 42); // UTC for ICT 22:42
// Also test if time zone direction is wrong:
debugForUtc(1986, 9, 18, 5, 42); // UTC if local time treated as UTC+7 incorrectly
