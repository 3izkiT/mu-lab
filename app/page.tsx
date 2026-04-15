import FortuneForm from "@/components/FortuneForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#ffffff_0%,#f8f3e8_45%,#0f1f3d_100%)] px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-6xl">
        <div className="rounded-3xl border border-white/40 bg-white/35 p-6 shadow-[0_24px_80px_rgba(15,31,61,0.16)] backdrop-blur-xl sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            <div className="space-y-6">
              <p className="inline-flex rounded-full border border-[#cfb57c]/40 bg-white/60 px-4 py-1 text-sm font-medium tracking-wide text-[#8b6a2e]">
                Modern Minimalist Luxury
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#0f1f3d] sm:text-5xl">
                Mu-Lab
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-700 sm:text-lg">
                ไขรหัสชีวิตรายบุคคลด้วย AI ห้องทดลองโหราศาสตร์ยุคใหม่
              </p>
              <div className="grid max-w-xl gap-4 text-sm text-slate-700 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/60 bg-white/55 p-4 backdrop-blur">
                  ดูแนวโน้มชีวิตในแบบที่อ่านง่ายและนำไปใช้ได้จริง
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/55 p-4 backdrop-blur">
                  ผสานหลักโหราศาสตร์กับ AI อย่างนุ่มนวลและทันสมัย
                </div>
              </div>
            </div>
            <FortuneForm />
          </div>
        </div>
      </section>
    </main>
  );
}
