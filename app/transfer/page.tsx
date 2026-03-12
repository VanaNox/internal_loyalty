'use client';

import { Header } from '@/components/header';
import { colleagues, gems } from '@/lib/data';
import { useMemo, useState } from 'react';

export default function TransferPage() {
  const [query, setQuery] = useState('');
  const sorted = useMemo(
    () => [...colleagues].sort((a, b) => a.localeCompare(b, 'uk')).filter((name) => name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <>
      <Header active="/transfer" />
      <main className="mx-auto flex w-full max-w-6xl justify-center px-4 py-8 md:px-6">
        <section className="glass w-full max-w-3xl p-8">
          <h1 className="mb-8 text-center text-3xl font-semibold">Винагородити Колегу</h1>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-center">
              <span className="text-sm text-slate-300">Кому</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-xl border border-white/20 bg-slate-900/70 px-4 py-3" placeholder="Пошук колеги" />
              <div className="max-h-40 overflow-auto rounded-xl border border-white/10 bg-slate-900/50 p-2 text-left">
                {sorted.map((item) => (
                  <div key={item} className="rounded-lg px-3 py-2 text-sm hover:bg-white/10">{item}</div>
                ))}
              </div>
            </label>
            <label className="space-y-2 text-center">
              <span className="text-sm text-slate-300">Тип гему</span>
              <select className="w-full rounded-xl border border-white/20 bg-slate-900/70 px-4 py-3">
                {gems.map((gem) => (
                  <option key={gem.name}>{gem.name}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="mt-4 block space-y-2 text-center">
            <span className="text-sm text-slate-300">Коментар (за що дякуєте)</span>
            <textarea className="h-32 w-full rounded-xl border border-white/20 bg-slate-900/70 px-4 py-3" />
          </label>
          <button className="mx-auto mt-6 flex h-12 min-w-56 items-center justify-center rounded-xl bg-sky-500 px-8 text-base font-semibold text-slate-950 transition hover:bg-sky-400">
            Винагородити
          </button>
        </section>
      </main>
    </>
  );
}
