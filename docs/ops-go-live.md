## Mu‑Lab Go‑Live Checklist (Ops)

### 1) ตั้งค่าโดเมนบน Vercel (คำตอบเรื่อง “Vercel ยังไม่ล่อยให้”)
- **`mu-lab.vercel.app` ใช้ได้ทันที** (เป็นโดเมนฟรีของ Vercel)
- ถ้าหมายถึง “ผูกโดเมนของตัวเอง” (เช่น `mu-lab.app`) จะต้อง:
  - **ซื้อโดเมน** จากผู้ให้บริการโดเมน (Cloudflare / Namecheap / Google Domains ฯลฯ)
  - ไปที่ **Vercel → Project → Settings → Domains** แล้วเพิ่มโดเมน
  - ตั้งค่า **DNS** ตามที่ Vercel บอก (A/AAAA หรือ CNAME)
  - รอ DNS propagate แล้ว Vercel จะขึ้นว่า **Valid Configuration**

> ถ้าคุณ “ซื้อโดเมนแล้ว” และถามว่า “ซื้อแล้วจะได้เลยมั้ย” — โดยทั่วไป **ได้** แต่ขึ้นกับการตั้ง DNS ถูกต้อง และเวลารอ DNS (มัก 5–30 นาที บางทีนานกว่านั้น)

### 2) Environment Variables (Production)
ต้องมีอย่างน้อย:
- `NEXT_PUBLIC_SITE_URL` = `https://<โดเมนจริง>`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `STRIPE_WEBHOOK_SECRET`
- `CRON_SECRET` (แนะนำให้มี)
- (แนะนำ) ปิด demo:
  - `NEXT_PUBLIC_ALLOW_DEMO_LOGIN=0`
  - `ALLOW_DEMO_LOGIN=0`

สำคัญ:
- หลังแก้ Environment Variables ให้ **Redeploy production** เพื่อให้ค่าใหม่มีผลกับ runtime

### 3) สร้าง `CRON_SECRET` (ทำยังไง)
เป้าหมาย: ใช้เป็น “กุญแจ” เรียก endpoint ที่ต้องการสิทธิ์ เช่น readiness check

ตัวอย่างสร้างบน Windows (PowerShell):

```powershell
# สร้าง secret แบบยาวและปลอดภัย (แนะนำ)
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)
$secret
```

นำค่าที่ได้ไปใส่ที่ Vercel (Production env) เป็น `CRON_SECRET`

### 4) ตรวจ readiness หลังตั้ง env
เรียก endpoint นี้ (ต้องมี `CRON_SECRET`):
- `GET /api/admin/readiness`
- Header: `Authorization: Bearer <CRON_SECRET>`

PowerShell ตัวอย่าง:

```powershell
$BASE="https://mu-lab.vercel.app"
$CRON_SECRET="ใส่ค่า CRON_SECRET"
curl -s -H "Authorization: Bearer $CRON_SECRET" "$BASE/api/admin/readiness"
```

ควรได้:
- `env.missing: []`
- `ok: true`

### 5) OAuth (Google)
Callback URL ที่ต้องตั้งใน Google Console:
- `https://<โดเมนจริง>/api/auth/oauth/callback/google`

### 6) Stripe Webhook (ทดสอบ event จริง)
Webhook endpoint:
- `https://<โดเมนจริง>/api/webhook/stripe`

ขั้นทดสอบแบบเร็วสุด:
- ไป Stripe Dashboard → Developers → Webhooks → เลือก endpoint
- กด **Send test event**: `checkout.session.completed`
- ดู Delivery ว่าเป็น **2xx** และไม่มี error

### 7) ฐานข้อมูล + สมัครด้วยอีเมล (สำคัญถ้า “สมัครไม่ได้”)
ถ้าใช้ **Postgres / Neon / Vercel Postgres** บน production:
- ต้องรัน migration ให้ครบทุกครั้งที่ deploy สคีมาใหม่ เช่น
  `npx prisma migrate deploy` (ใน CI หรือ post-deploy script)
- ถ้าเจอ error จาก API ว่าไม่มีคอลัมน์ `passwordHash` / `birthSign` แปลว่า **ยังไม่ migrate**

ถ้าใช้ **SQLite บน Vercel serverless** (ไฟล์ใน image):
- การเขียน DB ระหว่างรันอาจไม่ถาวร — แนะนำย้ายไป **Postgres แบบ hosted** สำหรับ production จริง

### 8) ⚠️ Critical ก่อน Go-Live: ย้ายจาก SQLite → Postgres
ระหว่างทดสอบ end-to-end บน production จริง พบว่า

- POST `/api/auth/email/register` → user ถูกสร้างใน lambda instance A
- POST `/api/analysis/save` → บังเอิญลง instance A เลยอ้างอิง user ได้ และ /vault อ่านเห็น
- GET `/analysis/<id>` → request ถัด ๆ มาบาง request วิ่งไป **instance B**
  ซึ่งมีแต่ `prisma/baseline.sqlite` เปล่าๆ จึงตอบ "ไม่พบผลวิเคราะห์"
  พร้อม `getCurrentUser()` คืน `null` (header กลายเป็น "Log in" ทั้งที่มี cookie อยู่)

สาเหตุเชิงระบบ:
- Vercel จะ scale ฟังก์ชัน serverless เป็น **หลาย instance**
- `lib/prisma.ts` คัดลอก `prisma/baseline.sqlite` → `/tmp/mu-lab-runtime.db` ใน **แต่ละ instance แยกกัน**
- การเขียนใน instance A จึง **ไม่ replicate** ไป instance B/C/D

แปลว่าก่อนเปิดให้ผู้ใช้จริง **ต้องย้าย DB เป็น service ที่แชร์ได้** (Postgres) ตัวเลือกแนะนำ:

#### A. Vercel Postgres (กดง่ายสุด)
1. Vercel → Storage → Create Database → Postgres
2. เลือก project `mu-lab` แล้วกด Connect — Vercel จะตั้ง `POSTGRES_PRISMA_URL` ให้อัตโนมัติ
3. ใน repo:
   - แก้ `prisma/schema.prisma`: `provider = "postgresql"`, `url = env("POSTGRES_PRISMA_URL")`
   - ใน `lib/prisma.ts`: ใช้ `new PrismaClient()` ปกติ (ลบโค้ดคัดลอก /tmp/baseline ออก)
   - รัน `npx prisma migrate dev -n init_pg` (สร้าง migration ใหม่ชุดเดียวจาก schema)
4. Push → Vercel จะรัน `prisma generate` ใน postinstall และเรียก `prisma migrate deploy` (เพิ่มให้)

#### B. Neon (free tier, ภายนอก)
1. สมัคร https://neon.tech → New Project (region ใกล้สุด)
2. คัดลอก connection string (รูปแบบ `postgres://...?sslmode=require`)
3. Vercel → Project Settings → Environment Variables → เพิ่ม `DATABASE_URL`
4. ทำ schema/migrate เหมือนข้อ A

#### Migration script ที่ต้องเพิ่มใน package.json
```json
"scripts": {
  "postinstall": "prisma generate",
  "vercel-build": "prisma migrate deploy && next build"
}
```
เปลี่ยน Build Command บน Vercel เป็น `npm run vercel-build`

#### หลังย้ายแล้วไม่ต้องใช้
- `prisma/baseline.sqlite` (ลบทิ้งหรือเก็บไว้สำหรับ dev เฉย ๆ)
- โค้ดคัดลอก /tmp ใน `lib/prisma.ts`

> ปล. ระหว่างที่ยังใช้ SQLite อยู่ — flow แบบ single-session demo (สมัคร → ทำนาย → ดู vault ทันที) ใช้ได้เพราะมัก hit instance เดียวกัน แต่ flow ที่หลายผู้ใช้พร้อมกันหรือเปิดลิงก์ analysis วันถัดไป **จะเชื่อถือไม่ได้**

