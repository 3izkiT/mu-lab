import { Observer, Rotation_HOR_ECL, VectorFromHorizon, RotateVector, SphereFromVector } from 'astronomy-engine';
const dateLocal = new Date(Date.UTC(1986, 8, 17, 22, 42));
const dateUtc = new Date(Date.UTC(1986, 8, 17, 15, 42));
const obs = new Observer(8.432, 99.968, 0);
for (const dt of [{name:'local as UTC',d:dateLocal},{name:'utc properly',d:dateUtc}]){
  const horToEcl = Rotation_HOR_ECL(dt.d, obs);
  const sphere = SphereFromVector(RotateVector(horToEcl, VectorFromHorizon({ lat:0, lon:90, dist:1 }, dt.d, "")));
  console.log(dt.name, dt.d.toISOString(), sphere.lon);
}
