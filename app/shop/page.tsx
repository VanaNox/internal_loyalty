import { Header } from '@/components/header';
import { products } from '@/lib/data';

export default function ShopPage() {
  return (
    <>
      <Header active="/shop" />
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:px-6">
        <h1 className="text-3xl font-semibold">Магазин</h1>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article key={product.name} className="glass p-5">
              <p className="text-xs uppercase tracking-wide text-slate-400">{product.category}</p>
              <h2 className="mt-2 text-lg font-semibold">{product.name}</h2>
              <p className="mt-3 text-sky-200">{product.price} total gems</p>
              <button className="mt-4 rounded-lg bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20">Обміняти</button>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
