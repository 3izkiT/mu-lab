const { Observer, Rotation_HOR_ECL, VectorFromHorizon, RotateVector, SphereFromVector } = require('astronomy-engine');
const norm = (v) => (((v % 360) + 360) % 360);
const getAyanamsa = (dateUtc) => {
  const reference = Date.UTC(2000, 0, 1, 12, 0, 0);
  const daysSinceReference = (dateUtc.getTime() - reference) / 86400000;
  const yearsSinceReference = daysSinceReference / 365.25;
  const degreesPerYear = 50.26 / 3600 / 365.25;
  return 23.855 + yearsSinceReference * degreesPerYear;
};
for (const offset of [-9, -7, -5]) {
  const dateUtc = new Date(Date.UTC(1986, 8, 17, 22 + offset, 42));
  const obs = new Observer(8.432, 99.968, 0);
  const horToEcl = Rotation_HOR_ECL(dateUtc, obs);
  const hor = VectorFromHorizon({ lat: 0, lon: 90, dist: 1 }, dateUtc, "");
  const ecl = SphereFromVector(RotateVector(horToEcl, hor));
  const sid = norm(ecl.lon - getAyanamsa(dateUtc));
  console.log(offset, dateUtc.toISOString(), ecl.lon.toFixed(6), getAyanamsa(dateUtc).toFixed(6), sid.toFixed(6), Math.floor(sid / 30));
}
