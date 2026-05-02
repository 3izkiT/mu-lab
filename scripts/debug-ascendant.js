const { Observer, Rotation_ECL_HOR, VectorFromSphere, HorizonFromVector, RotateVector } = require('astronomy-engine');
const observer = new Observer(8.432, 99.968, 0);
const date = new Date(Date.UTC(1986, 8, 17, 15, 42));
const eclToHor = Rotation_ECL_HOR(date, observer);
for (let lon = 0; lon < 360; lon += 30) {
  const ecl = { lat: 0, lon, dist: 1 };
  const v = VectorFromSphere(ecl, date);
  const hor = HorizonFromVector(RotateVector(eclToHor, v), "");
  console.log('lon', lon, 'alt', hor.lat.toFixed(3), 'az', hor.lon.toFixed(3));
}
