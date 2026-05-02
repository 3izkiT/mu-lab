const { Observer, Rotation_ECL_HOR, VectorFromSphere, RotateVector, HorizonFromVector } = require('astronomy-engine');
const obs = new Observer(8.432, 99.968, 0);
const norm = (v) => (((v % 360) + 360) % 360);
const asc = (date) => {
  const rot = Rotation_ECL_HOR(date, obs);
  const alt = (lon) => HorizonFromVector(RotateVector(rot, VectorFromSphere({ lat: 0, lon: norm(lon), dist: 1 }, date)), "").lat;
  let lo = 0;
  let hi = 360;
  let loAlt = alt(lo);
  for (let i = 0; i < 72; i += 1) {
    const mid = (lo + hi) / 2;
    const midAlt = alt(mid);
    if (Math.sign(midAlt) === Math.sign(loAlt)) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) / 2;
};
const signs = ["เมษ","พฤษภ","เมถุน","กรกฎ","สิงห์","กันย์","ตุลย์","พิจิก","ธนู","มังกร","กุมภ์","มีน"];
for (let offset = -3; offset <= 10; offset += 1) {
  const d = new Date(Date.UTC(1986, 8, 17, 15 + offset, 42));
  const a = asc(d);
  const s = norm(a - 23.855);
  const sign = signs[Math.floor(s / 30) % 12];
  console.log(`${offset}: asc ${a.toFixed(3)} sid ${s.toFixed(3)} ${sign}`);
}
