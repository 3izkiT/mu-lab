import {
  Observer,
  RotateVector,
  Rotation_HOR_ECL,
  SphereFromVector,
  VectorFromHorizon,
} from "astronomy-engine";

const THAI_BIRTH_SIGNS = [
  "เมษ",
  "พฤษภ",
  "เมถุน",
  "กรกฎ",
  "สิงห์",
  "กันย์",
  "ตุลย์",
  "พิจิก",
  "ธนู",
  "มังกร",
  "กุมภ์",
  "มีน",
] as const;

const PROVINCE_COORDINATES: Record<string, { lat: number; lon: number }> = {
  "นครศรีธรรมราช": { lat: 8.432, lon: 99.968 },
  "นครศรีฯ": { lat: 8.432, lon: 99.968 },
  "กรุงเทพมหานคร": { lat: 13.7563, lon: 100.5018 },
  "กรุงเทพ": { lat: 13.7563, lon: 100.5018 },
};

function normalizeProvince(raw: string): string {
  return raw
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\u00A0/g, " ")
    .replace(/นครศรี\s*ธรรมราช/i, "นครศรีธรรมราช")
    .replace(/\./g, "")
    .toLowerCase();
}

function parseBirthDate(dateString: string): { year: number; month: number; day: number } | null {
  const normalized = dateString.trim().replace(/\s+/g, " ");
  const ddmmyyyy = /^([0-3]?\d)[\/\-]([0-1]?\d)[\/\-](\d{4})$/;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/;

  let year: number;
  let month: number;
  let day: number;

  const ddmmyyyyMatch = normalized.match(ddmmyyyy);
  if (ddmmyyyyMatch) {
    day = Number(ddmmyyyyMatch[1]);
    month = Number(ddmmyyyyMatch[2]);
    year = Number(ddmmyyyyMatch[3]);
  } else {
    const isoMatch = normalized.match(iso);
    if (isoMatch) {
      year = Number(isoMatch[1]);
      month = Number(isoMatch[2]);
      day = Number(isoMatch[3]);
    } else {
      const parsed = new Date(normalized);
      if (Number.isNaN(parsed.getTime())) return null;
      return {
        year: parsed.getUTCFullYear(),
        month: parsed.getUTCMonth() + 1,
        day: parsed.getUTCDate(),
      };
    }
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  return { year, month, day };
}

function parseBirthTime(hour?: string, minute?: string) {
  const h = Number(hour?.trim() ?? "");
  const m = Number(minute?.trim() ?? "");
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { hour: h, minute: m };
}

function getProvinceCoordinates(province?: string) {
  if (!province) {
    return { lat: 13.7563, lon: 100.5018 };
  }
  const key = normalizeProvince(province);
  return PROVINCE_COORDINATES[key] ?? { lat: 13.7563, lon: 100.5018 };
}

function normalizeAngle(value: number) {
  return (((value % 360) + 360) % 360);
}

function getAyanamsa(dateUtc: Date) {
  const reference = Date.UTC(2000, 0, 1, 12, 0, 0);
  const daysSinceReference = (dateUtc.getTime() - reference) / 86400000;
  const yearsSinceReference = daysSinceReference / 365.25;
  const degreesPerYear = 50.26 / 3600 / 365.25;
  return 23.855 + yearsSinceReference * degreesPerYear;
}

function getAscendantLongitude(dateUtc: Date, lat: number, lon: number) {
  const observer = new Observer(lat, lon, 0);
  const horToEcl = Rotation_HOR_ECL(dateUtc, observer);
  const risingVector = VectorFromHorizon({ lat: 0, lon: 90, dist: 1 }, dateUtc, "");
  const eclVector = RotateVector(horToEcl, risingVector);
  const eclSphere = SphereFromVector(eclVector);
  const siderealLongitude = normalizeAngle(eclSphere.lon - getAyanamsa(dateUtc));
  return siderealLongitude;
}

export function getThaiBirthSign(
  birthDate: string,
  birthHour?: string,
  birthMinute?: string,
  birthProvince?: string,
): string {
  const parsedDate = parseBirthDate(birthDate);
  if (!parsedDate) {
    return "ไม่พบลักขณา";
  }

  const time = parseBirthTime(birthHour, birthMinute);
  if (time) {
    const coords = getProvinceCoordinates(birthProvince);
    const birthUtc = new Date(
      Date.UTC(
        parsedDate.year,
        parsedDate.month - 1,
        parsedDate.day,
        time.hour - 9,
        time.minute,
      ),
    );
    const ascendantLongitude = getAscendantLongitude(birthUtc, coords.lat, coords.lon);
    const signIndex = Math.floor(normalizeAngle(ascendantLongitude) / 30) % 12;
    return THAI_BIRTH_SIGNS[signIndex];
  }

  const month = parsedDate.month;
  const day = parsedDate.day;
  const sunSigns = [
    { name: "มังกร", start: "12-22", end: "01-21" },
    { name: "กุมภ์", start: "01-22", end: "02-21" },
    { name: "มีน", start: "02-22", end: "03-21" },
    { name: "เมษ", start: "03-22", end: "04-21" },
    { name: "พฤษภ", start: "04-22", end: "05-21" },
    { name: "เมถุน", start: "05-22", end: "06-21" },
    { name: "กรกฎ", start: "06-22", end: "07-21" },
    { name: "สิงห์", start: "07-22", end: "08-21" },
    { name: "กันย์", start: "08-22", end: "09-21" },
    { name: "ตุลย์", start: "09-22", end: "10-21" },
    { name: "พิจิก", start: "10-22", end: "11-21" },
    { name: "ธนู", start: "11-22", end: "12-21" },
  ];

  for (const sign of sunSigns) {
    const [startMonth, startDay] = sign.start.split("-").map(Number);
    const [endMonth, endDay] = sign.end.split("-").map(Number);

    if (startMonth <= endMonth) {
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (month > startMonth && month < endMonth)
      ) {
        return sign.name;
      }
    } else {
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        month > startMonth ||
        month < endMonth
      ) {
        return sign.name;
      }
    }
  }

  return "ไม่พบลักขณา";
}
