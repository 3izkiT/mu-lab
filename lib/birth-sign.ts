const thaiBirthSigns = [
  { name: 'มังกร', start: '12-22', end: '01-21' },
  { name: 'กุมภ์', start: '01-22', end: '02-21' },
  { name: 'มีน', start: '02-22', end: '03-21' },
  { name: 'เมษ', start: '03-22', end: '04-21' },
  { name: 'พฤษภ', start: '04-22', end: '05-21' },
  { name: 'เมถุน', start: '05-22', end: '06-21' },
  { name: 'กรกฎ', start: '06-22', end: '07-21' },
  { name: 'สิงห์', start: '07-22', end: '08-21' },
  { name: 'กันย์', start: '08-22', end: '09-21' },
  { name: 'ตุลย์', start: '09-22', end: '10-21' },
  { name: 'พิจิก', start: '10-22', end: '11-21' },
  { name: 'ธนู', start: '11-22', end: '12-21' },
];

export function getThaiBirthSign(birthDate: string): string {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const sign of thaiBirthSigns) {
    const [startMonth, startDay] = sign.start.split('-').map(Number);
    const [endMonth, endDay] = sign.end.split('-').map(Number);

    if (startMonth <= endMonth) {
      // Same year range
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (month > startMonth && month < endMonth)
      ) {
        return sign.name;
      }
    } else {
      // Wrap-around range (e.g., Capricorn: Dec 22 - Jan 21)
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (month > startMonth || month < endMonth)
      ) {
        return sign.name;
      }
    }
  }

  return 'ไม่พบลักขณา';
}