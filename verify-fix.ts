import { getThaiBirthSign } from './lib/birth-sign';
import { Observer, Rotation_HOR_ECL, VectorFromHorizon, RotateVector, SphereFromVector } from 'astronomy-engine';

// Manual test - try both directions
const observer = new Observer(8.432, 99.968, 0);
const dateUtc = new Date(Date.UTC(1986, 8, 17, 13, 42));
const horToEcl = Rotation_HOR_ECL(dateUtc, observer);

for (const horizonLon of [90, 270]) {
  const risingVector = VectorFromHorizon({ lat: 0, lon: horizonLon, dist: 1 }, dateUtc, "");
  const eclVector = RotateVector(horToEcl, risingVector);
  const eclSphere = SphereFromVector(eclVector);
  const ay = 23.855 + (((dateUtc.getTime() - Date.UTC(2000, 0, 1, 12, 0, 0)) / 86400000) / 365.25) * (50.26 / 3600 / 365.25);
  const sidereal = ((eclSphere.lon - ay) % 360 + 360) % 360;
  console.log(`Horizon lon ${horizonLon}:`);
  console.log('  eclSphere.lon:', eclSphere.lon);
  console.log('  sidereal:', sidereal);
  console.log('  sign index:', Math.floor(sidereal / 30));
}
console.log('\nFunction result:', getThaiBirthSign('17/09/1986', '22', '42', 'นครศรีธรรมราช'));
