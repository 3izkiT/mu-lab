const { Observer, Rotation_HOR_ECL, VectorFromHorizon, RotateVector, SphereFromVector } = require('astronomy-engine');
const obs = new Observer(8.432, 99.968, 0);
const norm = (v) => (((v % 360) + 360) % 360);
const signName = (lon) => {
  const signs = ["เมษ","พฤษภ","เมถุน","กรกฎ","สิงห์","กันย์","ตุลย์","พิจิก","ธนู","มังกร","กุมภ์","มีน"];
  return signs[Math.floor(norm(lon) / 30) % 12];
};
for (let minute = 0; minute < 60; minute += 1) {
  const date = new Date(Date.UTC(1986, 8, 17, 15, minute)); // 22:MM local
  const hor = VectorFromHorizon({ lat: 0, lon: 90, dist: 1 }, date, "");
  const ecl = SphereFromVector(RotateVector(Rotation_HOR_ECL(date, obs), hor));
  const sid = norm(ecl.lon - 23.855);
  if (Math.floor(sid / 30) !== 1) {
    console.log(`${minute}: ${ecl.lon.toFixed(3)} -> ${sid.toFixed(3)} ${signName(sid)}`);
    break;
  }
}
