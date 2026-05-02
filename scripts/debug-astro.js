const fs = require('fs');
const path = require('path');
const p = path.join(path.dirname(require.resolve('astronomy-engine')), '..', 'astronomy.d.ts');
const s = fs.readFileSync(p, 'utf8');
const names = ['VectorFromHorizon', 'HorizonFromVector', 'Rotation_HOR_ECL'];
for (const name of names) {
  const idx = s.indexOf(name);
  console.log('---', name, '---');
  console.log(s.slice(Math.max(0, idx - 200), idx + 400));
}
