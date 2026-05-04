const fetch = globalThis.fetch || require('node-fetch');
(async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/fortune', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'อ จักริน ยี่สุ่น',
        gender: 'male',
        birthDate: '17/09/1986',
        birthHour: '22',
        birthMinute: '42',
        birthProvince: 'นครศรีธรรมราช',
      }),
    });
    const text = await res.text();
    console.log('status', res.status);
    console.log(text);
  } catch (err) {
    console.error(err);
  }
})();
