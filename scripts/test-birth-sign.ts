import { getThaiBirthSign } from "../lib/birth-sign";

/** Regression: จักริน ยี่สุ่น — 17/09/1986 22:42 นครศรีฯ → ลักขณาราศีเมษ (ตามอ้างอิงผู้ใช้) */
const jackrin = getThaiBirthSign("17/09/1986", "22", "42", "นครศรีฯ");
if (jackrin !== "เมษ") {
  console.error("FAIL: expected เมษ, got", jackrin);
  process.exit(1);
}
console.log("OK jackrin case:", jackrin);
console.log("Nakhon full name:", getThaiBirthSign("17/09/1986", "22", "42", "นครศรีธรรมราช"));
