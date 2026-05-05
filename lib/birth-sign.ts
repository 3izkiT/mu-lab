import {
  Observer,
  RotateVector,
  Rotation_HOR_ECL,
  SphereFromVector,
  VectorFromHorizon,
} from "astronomy-engine";

const THAI_BIRTH_SIGNS = [
  "เมษ", // 0° - 30°  (Aries)
  "พฤษภ", // 30° - 60° (Taurus)
  "เมถุน", // 60° - 90° (Gemini)
  "กรกฎ", // 90° - 120° (Cancer)
  "สิงห์", // 120° - 150° (Leo)
  "กันย์", // 150° - 180° (Virgo)
  "ตุลย์", // 180° - 210° (Libra)
  "พิจิก", // 210° - 240° (Scorpio)
  "ธนู", // 240° - 270° (Sagittarius)
  "มังกร", // 270° - 300° (Capricorn)
  "กุมภ์", // 300° - 330° (Aquarius)
  "มีน", // 330° - 360° (Pisces)
] as const;

/**
 * พิกัดศาลากลางจังหวัด (เลือกใช้กับการหาลักขณา — ความผิดพลาด ±0.5° ลองจิจูดในเขตจังหวัด
 * เปลี่ยนผลรวมเพียงไม่กี่นาทีของวงเส้นรอบจักรราศี ไม่ข้ามขอบราศี)
 */
const PROVINCE_COORDINATES: Record<string, { lat: number; lon: number }> = {
  กรุงเทพมหานคร: { lat: 13.7563, lon: 100.5018 },
  กระบี่: { lat: 8.0863, lon: 98.9063 },
  กาญจนบุรี: { lat: 14.0227, lon: 99.5328 },
  กาฬสินธุ์: { lat: 16.4322, lon: 103.5061 },
  กำแพงเพชร: { lat: 16.4827, lon: 99.5226 },
  ขอนแก่น: { lat: 16.4419, lon: 102.836 },
  จันทบุรี: { lat: 12.6112, lon: 102.1035 },
  ฉะเชิงเทรา: { lat: 13.6904, lon: 101.0779 },
  ชลบุรี: { lat: 13.3611, lon: 100.9847 },
  ชัยนาท: { lat: 15.1851, lon: 100.1252 },
  ชัยภูมิ: { lat: 15.8068, lon: 102.0316 },
  ชุมพร: { lat: 10.4949, lon: 99.1797 },
  เชียงราย: { lat: 19.9105, lon: 99.8406 },
  เชียงใหม่: { lat: 18.7883, lon: 98.9853 },
  ตรัง: { lat: 7.5645, lon: 99.6239 },
  ตราด: { lat: 12.2428, lon: 102.5168 },
  ตาก: { lat: 16.8839, lon: 99.1258 },
  นครนายก: { lat: 14.2069, lon: 101.2131 },
  นครปฐม: { lat: 13.8196, lon: 100.0644 },
  นครพนม: { lat: 17.392, lon: 104.7693 },
  นครราชสีมา: { lat: 14.9799, lon: 102.0978 },
  นครศรีธรรมราช: { lat: 8.4304, lon: 99.9631 },
  นครสวรรค์: { lat: 15.7047, lon: 100.137 },
  นนทบุรี: { lat: 13.8622, lon: 100.5142 },
  นราธิวาส: { lat: 6.4254, lon: 101.8253 },
  น่าน: { lat: 18.7756, lon: 100.7731 },
  บึงกาฬ: { lat: 18.3609, lon: 103.6464 },
  บุรีรัมย์: { lat: 14.9931, lon: 103.1029 },
  ปทุมธานี: { lat: 14.0208, lon: 100.5251 },
  ประจวบคีรีขันธ์: { lat: 11.812, lon: 99.7973 },
  ปราจีนบุรี: { lat: 14.0579, lon: 101.3725 },
  ปัตตานี: { lat: 6.8692, lon: 101.2502 },
  พระนครศรีอยุธยา: { lat: 14.3692, lon: 100.5876 },
  พะเยา: { lat: 19.196, lon: 99.8946 },
  พังงา: { lat: 8.4502, lon: 98.5253 },
  พัทลุง: { lat: 7.6166, lon: 100.0743 },
  พิจิตร: { lat: 16.4396, lon: 100.3492 },
  พิษณุโลก: { lat: 16.8211, lon: 100.2659 },
  เพชรบุรี: { lat: 13.1116, lon: 99.9399 },
  เพชรบูรณ์: { lat: 16.4189, lon: 101.1591 },
  แพร่: { lat: 18.1445, lon: 100.1405 },
  ภูเก็ต: { lat: 7.8804, lon: 98.3923 },
  มหาสารคาม: { lat: 16.1851, lon: 103.3001 },
  มุกดาหาร: { lat: 16.5421, lon: 104.7228 },
  แม่ฮ่องสอน: { lat: 19.3014, lon: 97.9656 },
  ยโสธร: { lat: 15.7929, lon: 104.1452 },
  ยะลา: { lat: 6.5413, lon: 101.2803 },
  ร้อยเอ็ด: { lat: 16.054, lon: 103.6531 },
  ระนอง: { lat: 9.9529, lon: 98.6085 },
  ระยอง: { lat: 12.6814, lon: 101.2789 },
  ราชบุรี: { lat: 13.5283, lon: 99.8133 },
  ลพบุรี: { lat: 14.7995, lon: 100.6533 },
  ลำปาง: { lat: 18.2787, lon: 99.4877 },
  ลำพูน: { lat: 18.5746, lon: 99.0087 },
  เลย: { lat: 17.4861, lon: 101.7223 },
  ศรีสะเกษ: { lat: 15.1186, lon: 104.3221 },
  สกลนคร: { lat: 17.1545, lon: 104.1349 },
  สงขลา: { lat: 7.1898, lon: 100.5954 },
  สตูล: { lat: 6.6238, lon: 100.0673 },
  สมุทรปราการ: { lat: 13.5990, lon: 100.5998 },
  สมุทรสงคราม: { lat: 13.4098, lon: 100.0021 },
  สมุทรสาคร: { lat: 13.5475, lon: 100.2745 },
  สระแก้ว: { lat: 13.8242, lon: 102.0645 },
  สระบุรี: { lat: 14.5289, lon: 100.9101 },
  สิงห์บุรี: { lat: 14.8911, lon: 100.3964 },
  สุโขทัย: { lat: 17.0068, lon: 99.8265 },
  สุพรรณบุรี: { lat: 14.4744, lon: 100.1175 },
  สุราษฎร์ธานี: { lat: 9.139, lon: 99.3217 },
  สุรินทร์: { lat: 14.8826, lon: 103.4934 },
  หนองคาย: { lat: 17.8783, lon: 102.7414 },
  หนองบัวลำภู: { lat: 17.221, lon: 102.4262 },
  อ่างทอง: { lat: 14.5877, lon: 100.4546 },
  อำนาจเจริญ: { lat: 15.8657, lon: 104.6261 },
  อุดรธานี: { lat: 17.3647, lon: 102.8159 },
  อุตรดิตถ์: { lat: 17.621, lon: 100.0993 },
  อุทัยธานี: { lat: 15.3843, lon: 100.024 },
  อุบลราชธานี: { lat: 15.2287, lon: 104.857 },
};

const PROVINCE_ALIAS: Record<string, string> = {
  กรุงเทพ: "กรุงเทพมหานคร",
  กรุงเทพฯ: "กรุงเทพมหานคร",
  กทม: "กรุงเทพมหานคร",
  นครศรีฯ: "นครศรีธรรมราช",
  นครศรี: "นครศรีธรรมราช",
  ศรีสระเกษ: "ศรีสะเกษ",
  ศรีษะเกษ: "ศรีสะเกษ",
  ธนบุรี: "กรุงเทพมหานคร",
  พระนคร: "กรุงเทพมหานคร",
};

function normalizeProvince(raw: string): string {
  const cleaned = raw
    .trim()
    .replace(/\s+/g, "")
    .replace(/\u00A0/g, "")
    .replace(/\./g, "")
    .replace(/จังหวัด/g, "")
    .replace(/อำเภอ.+$/g, "");
  return PROVINCE_ALIAS[cleaned] ?? cleaned;
}

function parseBirthDate(dateString: string): { year: number; month: number; day: number } | null {
  const normalized = dateString.trim().replace(/\s+/g, " ");
  const ddmmyyyy = /^([0-3]?\d)[/\-]([0-1]?\d)[/\-](\d{4})$/;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/;

  const ddmmyyyyMatch = normalized.match(ddmmyyyy);
  if (ddmmyyyyMatch) {
    const day = Number(ddmmyyyyMatch[1]);
    const month = Number(ddmmyyyyMatch[2]);
    const year = Number(ddmmyyyyMatch[3]);
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    return { year, month, day };
  }

  const isoMatch = normalized.match(iso);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    return { year, month, day };
  }

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return null;
  return {
    year: parsed.getUTCFullYear(),
    month: parsed.getUTCMonth() + 1,
    day: parsed.getUTCDate(),
  };
}

function parseBirthTime(hour?: string, minute?: string) {
  const h = Number(hour?.trim() ?? "");
  const m = Number(minute?.trim() ?? "");
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { hour: h, minute: m };
}

function getProvinceCoordinates(province?: string) {
  const fallback = { lat: 13.7563, lon: 100.5018 }; // กรุงเทพ default
  if (!province) return fallback;
  const key = normalizeProvince(province);
  return PROVINCE_COORDINATES[key] ?? fallback;
}

function normalizeAngle(value: number) {
  return ((value % 360) + 360) % 360;
}

/**
 * Lahiri (Chitrapaksha) ayanamsa — รัฐบาลอินเดียประกาศใช้ และโหรไทยส่วนใหญ่ใช้
 * Reference: ที่ J2000.0 (1 ม.ค. 2000 12:00 UTC) ayanamsa = 23°51'10.79" = 23.852997°
 * อัตราเลื่อน (precession) ~50.288 arcsec/yr ≈ 0.013969°/yr
 */
function getAyanamsa(dateUtc: Date) {
  const J2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
  const days = (dateUtc.getTime() - J2000) / 86400000;
  const years = days / 365.25;
  return 23.852997 + (years * 50.288) / 3600;
}

/**
 * คำนวณตำแหน่งราศีขึ้น (Ascendant) แบบ Sidereal/Lahiri
 *
 * วิธี: หาจุดที่ "เส้นขอบฟ้าทิศตะวันออก (alt=0, az=90)" ตัดกับ "วงระนาบสุริยวิถี"
 * แล้วแปลงพิกัดจากระบบ horizon → ecliptic → ลด ayanamsa ออกเพื่อได้ longitude แบบ sidereal
 */
function getAscendantLongitude(dateUtc: Date, lat: number, lon: number) {
  const observer = new Observer(lat, lon, 0);
  const horToEcl = Rotation_HOR_ECL(dateUtc, observer);
  const eastHorizonVector = VectorFromHorizon({ lat: 0, lon: 90, dist: 1 }, dateUtc, "");
  const eclVector = RotateVector(horToEcl, eastHorizonVector);
  const eclSphere = SphereFromVector(eclVector);
  const tropicalLongitude = normalizeAngle(eclSphere.lon);
  return normalizeAngle(tropicalLongitude - getAyanamsa(dateUtc));
}

export type ThaiBirthSignDetail = {
  /** ราศี เช่น "พฤษภ" */
  signName: string;
  /** index 0–11 (เมษ=0 .. มีน=11) */
  signIndex: number;
  /** องศาภายในราศี 0–30 */
  degInSign: number;
  /** Sidereal longitude 0–360° */
  siderealLongitude: number;
  /** true = คำนวณจากเวลา/พิกัด, false = ใช้ราศีพระอาทิตย์เป็น fallback */
  hasTimeAndPlace: boolean;
};

/**
 * คืนรายละเอียดลักขณา — ใช้เวลา + จังหวัดในการคำนวณ
 * ถ้าไม่มีเวลา → fallback เป็นราศีพระอาทิตย์ (Sun sign แบบประมาณตามวันที่)
 */
export function getBirthSignDetail(
  birthDate: string,
  birthHour?: string,
  birthMinute?: string,
  birthProvince?: string,
): ThaiBirthSignDetail | null {
  const parsedDate = parseBirthDate(birthDate);
  if (!parsedDate) return null;

  const time = parseBirthTime(birthHour, birthMinute);
  if (time) {
    const coords = getProvinceCoordinates(birthProvince);
    // เวลาท้องถิ่นไทย UTC+7 — แปลงเป็น UTC ก่อนยัดเข้า Date.UTC()
    const birthUtc = new Date(
      Date.UTC(parsedDate.year, parsedDate.month - 1, parsedDate.day, time.hour - 7, time.minute),
    );
    const sidereal = getAscendantLongitude(birthUtc, coords.lat, coords.lon);
    const signIndex = Math.floor(sidereal / 30) % 12;
    return {
      signName: THAI_BIRTH_SIGNS[signIndex],
      signIndex,
      degInSign: sidereal - signIndex * 30,
      siderealLongitude: sidereal,
      hasTimeAndPlace: true,
    };
  }

  const month = parsedDate.month;
  const day = parsedDate.day;
  // Sun sign แบบประมาณ (Tropical) — ใช้เป็น fallback ถ้าไม่มีเวลาเกิด
  const sunSigns: { name: (typeof THAI_BIRTH_SIGNS)[number]; start: [number, number]; end: [number, number] }[] = [
    { name: "มังกร", start: [12, 22], end: [1, 21] },
    { name: "กุมภ์", start: [1, 22], end: [2, 21] },
    { name: "มีน", start: [2, 22], end: [3, 21] },
    { name: "เมษ", start: [3, 22], end: [4, 21] },
    { name: "พฤษภ", start: [4, 22], end: [5, 21] },
    { name: "เมถุน", start: [5, 22], end: [6, 21] },
    { name: "กรกฎ", start: [6, 22], end: [7, 21] },
    { name: "สิงห์", start: [7, 22], end: [8, 21] },
    { name: "กันย์", start: [8, 22], end: [9, 21] },
    { name: "ตุลย์", start: [9, 22], end: [10, 21] },
    { name: "พิจิก", start: [10, 22], end: [11, 21] },
    { name: "ธนู", start: [11, 22], end: [12, 21] },
  ];

  for (const sign of sunSigns) {
    const [sm, sd] = sign.start;
    const [em, ed] = sign.end;
    let inRange = false;
    if (sm <= em) {
      inRange = (month === sm && day >= sd) || (month === em && day <= ed) || (month > sm && month < em);
    } else {
      inRange =
        (month === sm && day >= sd) || (month === em && day <= ed) || month > sm || month < em;
    }
    if (inRange) {
      const idx = THAI_BIRTH_SIGNS.indexOf(sign.name);
      return {
        signName: sign.name,
        signIndex: idx,
        degInSign: 15,
        siderealLongitude: idx * 30 + 15,
        hasTimeAndPlace: false,
      };
    }
  }
  return null;
}

/**
 * (Deprecated by detail) — เก็บไว้เพื่อ backward compat
 * คืนเฉพาะชื่อราศีลักขณา หรือ "ไม่พบลักขณา"
 */
export function getThaiBirthSign(
  birthDate: string,
  birthHour?: string,
  birthMinute?: string,
  birthProvince?: string,
): string {
  const detail = getBirthSignDetail(birthDate, birthHour, birthMinute, birthProvince);
  return detail ? detail.signName : "ไม่พบลักขณา";
}
