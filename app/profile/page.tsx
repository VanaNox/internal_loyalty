'use client';

import { Header } from '@/components/header';
import { myGems, profileUser, transactions, transferGems } from '@/lib/data';
import { useMemo, useState } from 'react';

const tabButtonClass =
  'rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300';

const badgeClassByGem: Record<string, string> = {
  Yellow: 'bg-amber-300/20 text-amber-100',
  'We Care': 'bg-pink-300/20 text-pink-100',
  'Better Together': 'bg-emerald-300/20 text-emerald-100',
  Gamechanger: 'bg-blue-300/20 text-blue-100',
  Managerial: 'bg-orange-300/20 text-orange-100',
  Transparent: 'bg-slate-300/20 text-slate-100'
};

function GemCard({ name, value, color, dot }: { name: string; value: number; color: string; dot: string }) {
  return (
    <article
      className={`glass group flex items-center justify-between gap-3 bg-gradient-to-br ${color} p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-black/50`}
    >
      <div>
        <p className="text-sm text-slate-300">{name}</p>
        <p className="mt-1 text-2xl font-bold leading-none">{value}</p>
      </div>
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${dot} text-lg text-slate-900 shadow-lg shadow-black/20`}
        aria-hidden="true"
      >
        ◆
      </span>
    </article>
  );
}

function GemsBlock({
  title,
  items
}: {
  title: string;
  items: { name: string; value: number; color: string; dot: string }[];
}) {
  return (
    <section className="glass p-5">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((gem) => (
          <GemCard key={gem.name} {...gem} />
        ))}
      </div>
    </section>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received');

  const filteredTransactions = useMemo(
    () => transactions.filter((transaction) => transaction.direction === activeTab),
    [activeTab]
  );

  return (
    <>
      <Header active="/profile" />
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Профіль користувача</h1>

        <section className="glass group relative overflow-hidden p-6">
          <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200 opacity-0 transition group-hover:opacity-100">
            Edit profile
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300/70 to-indigo-400/70 text-xl font-bold text-slate-950 shadow-xl shadow-sky-400/20">
              ОК
            </div>
            <div>
              <p className="text-lg font-semibold">{profileUser.name}</p>
              <p className="text-sm text-slate-300">{profileUser.email}</p>
              <p className="mt-1 text-xs text-slate-400">{profileUser.title}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <GemsBlock title="Мої геми" items={myGems} />
          </div>
          <div>
            <GemsBlock title="Доступні для Передачі" items={transferGems} />
          </div>
        </section>

        <section className="glass overflow-hidden p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Транзакції</h2>
            <div className="rounded-full border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                className={`${tabButtonClass} ${
                  activeTab === 'received' ? 'bg-sky-500/25 text-sky-100' : 'text-slate-300 hover:bg-white/10'
                }`}
                onClick={() => setActiveTab('received')}
              >
                Отримані
              </button>
              <button
                type="button"
                className={`${tabButtonClass} ${
                  activeTab === 'given' ? 'bg-sky-500/25 text-sky-100' : 'text-slate-300 hover:bg-white/10'
                }`}
                onClick={() => setActiveTab('given')}
              >
                Віддані
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-3 py-2">Дата</th>
                  <th className="px-3 py-2">Від</th>
                  <th className="px-3 py-2">Кому</th>
                  <th className="px-3 py-2">Тип гему</th>
                  <th className="px-3 py-2">Кількість</th>
                  <th className="px-3 py-2">Коментар</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="rounded-xl bg-white/[0.03] transition hover:bg-white/[0.07]">
                    <td className="px-3 py-3 text-slate-200">{transaction.date}</td>
                    <td className="px-3 py-3 text-slate-200">{transaction.from}</td>
                    <td className="px-3 py-3 text-slate-200">{transaction.to}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                          badgeClassByGem[transaction.gem] ?? 'bg-white/10 text-slate-100'
                        }`}
                      >
                        <span className="text-[10px]">●</span>
                        {transaction.gem}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-base font-semibold">{transaction.quantity}</td>
                    <td className="px-3 py-3 text-slate-300">{transaction.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
