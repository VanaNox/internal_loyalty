import { Header } from '@/components/header';
import { products } from '@/lib/data';

export default function ShopPage() {
  return (
    <div className="relative min-h-screen text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.12),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.12),transparent_36%),radial-gradient(circle_at_50%_100%,rgba(147,51,234,0.12),transparent_44%),linear-gradient(160deg,#050818,#0a1227_45%,#111634_100%)]" />
        <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(rgba(255,255,255,.35)_0.7px,transparent_0.7px)] [background-size:3px_3px]" />
      </div>

      <Header active="/shop" />

      <main className="mx-auto w-full max-w-[1650px] px-[calc(2rem+30px)] py-8 lg:px-[calc(3rem+30px)] lg:py-10">
        <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl shadow-[0_18px_48px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] lg:p-7">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-100">Store</h1>
            <p className="mt-1 text-sm text-slate-400">Redeem your gems for useful rewards.</p>
          </div>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.name}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.06]"
              >
                <p className="text-xs uppercase tracking-wide text-slate-400">{product.category}</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-100">{product.name}</h2>
                <p className="mt-3 text-sky-200">{product.price} total gems</p>
                <button className="mt-4 rounded-lg bg-white/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/20">
                  Redeem
                </button>
              </article>
            ))}
          </section>
        </section>
      </main>
    </div>
  );
}
