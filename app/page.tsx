import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 md:px-6">
      <section className="glass w-full max-w-md p-8">
        <p className="mb-3 text-sm uppercase tracking-[0.22em] text-sky-200/80">SFP Internal Loyalty Program</p>
        <h1 className="mb-6 text-3xl font-semibold text-white">Welcome to GemPulse</h1>
        <div className="space-y-4">
          <input className="w-full rounded-xl border border-white/20 bg-slate-900/70 px-4 py-3" placeholder="Email" />
          <input className="w-full rounded-xl border border-white/20 bg-slate-900/70 px-4 py-3" placeholder="Password" type="password" />
          <Link href="/profile" className="inline-flex w-full justify-center rounded-xl bg-sky-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-sky-400">
            Увійти
          </Link>
        </div>
      </section>
    </main>
  );
}
