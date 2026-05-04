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

#### 6.1 ตั้ง webhook endpoint ใน Stripe (ครั้งแรก)
1. https://dashboard.stripe.com → ขวาบนเปลี่ยนเป็น **Test mode** ก่อน (สวิตช์ "Test mode")
2. **Developers** → **Webhooks** → **Add endpoint**
3. URL: `https://mu-lab.vercel.app/api/webhook/stripe`
4. **Events to listen to**: เลือกอย่างน้อย
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. กด **Add endpoint**
6. หลังสร้าง คลิกเข้า endpoint → คัดลอกค่า **Signing secret** (`whsec_...`)
7. ไป Vercel → Project Settings → Environment Variables → ตั้ง `STRIPE_WEBHOOK_SECRET = whsec_...` (Production + Preview + Development)
8. Redeploy production เพื่อให้ค่ามีผล

#### 6.2 ทดสอบ event จริงจาก Dashboard
1. กลับไปที่ webhook endpoint ใน Stripe Dashboard
2. กดปุ่ม **Send test event** ที่มุมขวาบนของ endpoint
3. เลือก `checkout.session.completed` แล้วกด **Send test webhook**
4. ตรวจ Delivery:
   - ✅ Status `200 OK` = ผ่าน webhook + signature verify
   - ❌ `400 invalid signature` = `STRIPE_WEBHOOK_SECRET` ผิด/ยังไม่ redeploy
   - ❌ `500` = ดู logs ใน Vercel → Functions

#### 6.3 ทดสอบ end-to-end ด้วย Stripe CLI (ทางเลือก)
```bash
# Windows (PowerShell)
iwr -useb get.scoop.sh | iex; scoop install stripe
stripe login
stripe trigger checkout.session.completed --add checkout_session:client_reference_id=demo-user
```
ถ้าจะทดสอบกับ live mode จริงให้สลับ Test → Live ใน Dashboard และเปลี่ยน secret ใน Vercel เป็น live secret

### 7) ฐานข้อมูล + สมัครด้วยอีเมล (สำคัญถ้า “สมัครไม่ได้”)
ถ้าใช้ **Postgres / Neon / Vercel Postgres** บน production:
- ต้องรัน migration ให้ครบทุกครั้งที่ deploy สคีมาใหม่ เช่น
  `npx prisma migrate deploy` (ใน CI หรือ post-deploy script)
- ถ้าเจอ error จาก API ว่าไม่มีคอลัมน์ `passwordHash` / `birthSign` แปลว่า **ยังไม่ migrate**

ถ้าใช้ **SQLite บน Vercel serverless** (ไฟล์ใน image):
- การเขียน DB ระหว่างรันอาจไม่ถาวร — แนะนำย้ายไป **Postgres แบบ hosted** สำหรับ production จริง

### 8) ✅ Database (DONE — ใช้ Supabase Postgres)
ตอนนี้โปรเจกต์ migrate ไป **Supabase Postgres (Tokyo region)** แล้ว ผ่าน:
- `@prisma/adapter-pg` (รองรับ Vercel serverless)
- Vercel Supabase integration → ตั้ง `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING` ให้อัตโนมัติ
- `vercel-build` ใน `package.json` รัน `prisma migrate deploy && next build`

ข้อมูลผู้ใช้/analysis/tarot ทุกคนเก็บที่เดียวกัน — ทุก lambda instance อ่านได้ตรงกัน ✓

#### Maintenance ที่ต้องรู้
- **เพิ่มฟิลด์ใหม่**: แก้ `prisma/schema.prisma` → รัน `npx prisma migrate dev -n <name>` ในเครื่อง → push ไป Vercel จะ auto-migrate
- **Reset DB ใน emergency**: `vercel env pull .env.production.local` แล้ว `DATABASE_URL=$POSTGRES_PRISMA_URL npx prisma migrate reset` (ระวังลบข้อมูลผู้ใช้จริง!)
- **Monitor**: Supabase Dashboard → Database → ดู connections, query performance
- **Backup**: Supabase Free tier มี daily backup 7 วันให้อัตโนมัติ

### 9) Sentry (Error Monitoring)
- โค้ดมี `@sentry/nextjs` ติดตั้งแล้ว — **โหลดเฉพาะเมื่อมี DSN** (ไม่มีก็ no-op)
- ตั้งค่า:
  1. สมัคร https://sentry.io → Create project (Next.js)
  2. คัดลอก DSN จากหน้าโปรเจกต์
  3. Vercel env (Production):
     - `NEXT_PUBLIC_SENTRY_DSN=https://xxxx@oXXX.ingest.sentry.io/XXX`
     - `SENTRY_DSN=<same>`
     - (เลือกใส่) `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` — ถ้าจะให้ upload sourcemap อัตโนมัติ
  4. Redeploy → ลองตั้งใจให้ error เกิดในโปรดักชัน → ดูใน Sentry dashboard

### 10) Google AdSense
- โค้ดมี `<AdSenseScript />` + `<AdSlot slot=... />` พร้อมใช้
- โหลดเฉพาะเมื่อมี `NEXT_PUBLIC_ADSENSE_CLIENT` (รูปแบบ `ca-pub-XXXXXXXXXXXXXXXX`)
- ตำแหน่ง slot ปัจจุบัน: ท้ายบทความ daily-horoscope (ไม่ขัด conversion)
- ขั้นตอน Go-Live:
  1. https://www.google.com/adsense → Approve เว็บ (ใช้เวลา 1–14 วัน)
  2. หลัง approve → สร้าง ad unit → ได้ slot ID
  3. ตั้ง `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX` ใน Vercel env
  4. แก้ slot ID ใน `components/DailyHoroscopeArticleView.tsx` (ตอนนี้ placeholder `9876543210`)
  5. Redeploy

### 11) Performance / LCP
ปรับแล้ว:
- โลโก้ hero (260×260) `priority` + `fetchPriority="high"` → คาด LCP < 2.5s
- โลโก้ header `priority` (ทุกหน้า)
- `next.config.images.formats` = `[avif, webp]` → คนใหม่จะได้ภาพเล็กลง 30–60%

ทดสอบ:
```bash
# วัดด้วย Lighthouse CLI
npx lighthouse https://mu-lab.vercel.app/ --view --preset=desktop
npx lighthouse https://mu-lab.vercel.app/daily-horoscope --view
```
หรือ Chrome DevTools → Lighthouse tab

### 12) ⚠️ Legacy: ย้ายจาก SQLite → Postgres (เก็บไว้อ้างอิง)
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

