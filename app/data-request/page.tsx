"use client";

import { useState } from "react";
import Link from "next/link";

type RequestType = "access" | "delete" | "rectify" | "withdraw-consent";

const requestTypeLabels: Record<RequestType, string> = {
  access: "ขอเข้าถึงข้อมูลส่วนบุคคล",
  delete: "ขอลบข้อมูลส่วนบุคคล",
  rectify: "ขอแก้ไขข้อมูลส่วนบุคคล",
  "withdraw-consent": "ขอถอนความยินยอม",
};

export default function DataRequestPage() {
  const [requestType, setRequestType] = useState<RequestType>("access");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!fullName.trim() || !email.trim() || !details.trim()) {
      setMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    try {
      const response = await fetch("/api/data-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestType, fullName, email, details }),
      });
      const payload = (await response.json()) as { message?: string };
      setMessage(payload.message ?? (response.ok ? "ส่งคำขอเรียบร้อย" : "ไม่สามารถส่งคำขอได้"));
      if (response.ok) setDetails("");
    } catch {
      setMessage("เกิดข้อผิดพลาดในการส่งคำขอ กรุณาลองใหม่");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <div className="mu-lab-glass rounded-3xl border border-[rgba(247,231,206,0.2)] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/80">Data Subject Request</p>
        <h1 className="mt-3 font-serif text-3xl text-[#eef1ff]">แบบฟอร์มคำขอข้อมูลส่วนบุคคล</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#dbe1ff]/82">
          ใช้ฟอร์มนี้สำหรับยื่นคำขอเข้าถึงข้อมูล ลบข้อมูล แก้ไขข้อมูล หรือถอนความยินยอมในการประมวลผล
        </p>

        <div className="mt-6 space-y-4">
          <label className="block text-sm text-[#e8eeff]/88">
            ประเภทคำขอ
            <select
              value={requestType}
              onChange={(event) => setRequestType(event.target.value as RequestType)}
              className="mu-lab-input mt-2 w-full px-4 py-3"
            >
              {Object.entries(requestTypeLabels).map(([value, label]) => (
                <option key={value} value={value} className="bg-[#0a101c]">
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-[#e8eeff]/88">
            ชื่อ-นามสกุล
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="mu-lab-input mt-2 w-full px-4 py-3"
              placeholder="กรอกชื่อผู้ยื่นคำขอ"
            />
          </label>

          <label className="block text-sm text-[#e8eeff]/88">
            อีเมลสำหรับติดต่อกลับ
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mu-lab-input mt-2 w-full px-4 py-3"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm text-[#e8eeff]/88">
            รายละเอียดคำขอ
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              className="mu-lab-input mt-2 min-h-32 w-full px-4 py-3"
              placeholder="ระบุรายละเอียดให้ชัดเจน เช่น ช่วงเวลาข้อมูลที่ต้องการ หรือเหตุผลการขอลบข้อมูล"
            />
          </label>
        </div>

        {message ? <p className="mt-4 text-sm text-[var(--gold)]">{message}</p> : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-5 py-2 text-sm font-semibold text-[#241d16] disabled:opacity-50"
          >
            {isSubmitting ? "กำลังส่งคำขอ..." : "ส่งคำขอ"}
          </button>
          <Link
            href="/privacy"
            className="rounded-full border border-[rgba(247,231,206,0.28)] px-4 py-2 text-sm text-[var(--gold)]"
          >
            กลับไปอ่านนโยบาย
          </Link>
        </div>
      </div>
    </main>
  );
}
