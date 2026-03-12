'use client';

import { Header } from '@/components/header';
import { myGems, profileUser, transactions, transferGems } from '@/lib/data';
import { useMemo, useState } from 'react';

type HistoryTab = 'received' | 'given';

type GemItem = {
  name: string;
  value: number;
  ring: string;
  crystal: string;
};

const gemVisuals: Record<string, Pick<GemItem, 'ring' | 'crystal'>> = {
  Yellow: { ring: 'gem-ring-yellow', crystal: 'gem-crystal-yellow' },
  'We Care': { ring: 'gem-ring-pink', crystal: 'gem-crystal-pink' },
  'Better Together': { ring: 'gem-ring-green', crystal: 'gem-crystal-green' },
  Gamechanger: { ring: 'gem-ring-blue', crystal: 'gem-crystal-blue' },
  Managerial: { ring: 'gem-ring-amber', crystal: 'gem-crystal-yellow' },
  Transparent: { ring: 'gem-ring-ice', crystal: 'gem-crystal-ice' }
};

const badgeClassByGem: Record<string, string> = {
  Yellow: 'bg-amber-300/20 text-amber-900',
  'We Care': 'bg-pink-300/20 text-pink-900',
  'Better Together': 'bg-emerald-300/20 text-emerald-900',
  Gamechanger: 'bg-blue-300/20 text-blue-900',
  Managerial: 'bg-orange-300/20 text-orange-900',
  Transparent: 'bg-slate-300/30 text-slate-900'
};

function GemCrystal({ crystalClass }: { crystalClass: string }) {
  return (
    <svg className={`gem-crystal ${crystalClass}`} viewBox="0 0 44 44" aria-hidden="true">
      <defs>
        <linearGradient id="facetTop" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,.95)" />
          <stop offset="100%" stopColor="rgba(255,255,255,.45)" />
        </linearGradient>
      </defs>
      <path d="M8 13h28l4 8-18 20L4 21l4-8Z" fill="currentColor" opacity="0.95" />
      <path d="M8 13h28l-14 8-14-8Z" fill="url(#facetTop)" opacity="0.65" />
      <path d="M4 21h36M22 13v28M14 13l8 8 8-8" stroke="rgba(255,255,255,.55)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GemCard({ item }: { item: GemItem }) {
  return (
    <article className="profile-gem-card">
      <div>
        <p className="profile-gem-name">{item.name}</p>
        <p className="profile-gem-count">{item.value}</p>
      </div>
      <div className={`profile-gem-orb ${item.ring}`}>
        <GemCrystal crystalClass={item.crystal} />
      </div>
    </article>
  );
}

function GemsBlock({ title, items }: { title: string; items: GemItem[] }) {
  return (
    <section className="profile-surface p-5 md:p-6">
      <h2 className="profile-block-title">{title}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((gem) => (
          <GemCard key={gem.name} item={gem} />
        ))}
      </div>
    </section>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<HistoryTab>('received');

  const received = myGems.map((gem) => ({ ...gem, ...gemVisuals[gem.name] }));
  const transfer = transferGems.map((gem) => ({ ...gem, ...gemVisuals[gem.name] }));

  const filteredTransactions = useMemo(
    () => transactions.filter((transaction) => transaction.direction === activeTab),
    [activeTab]
  );

  return (
    <>
      <Header active="/profile" />
      <main className="profile-page-shell mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:px-6">
        <section className="profile-surface p-5 md:p-6">
          <div className="flex items-center gap-4">
            <div className="profile-avatar">{profileUser.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}</div>
            <div>
              <p className="text-3xl font-semibold text-slate-800">{profileUser.name}</p>
              <p className="mt-1 text-sm text-slate-500">{profileUser.email}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <GemsBlock title="Мої геми" items={received} />
          </div>
          <div>
            <GemsBlock title="Доступні для Передачі" items={transfer} />
          </div>
        </section>

        <section className="profile-surface p-5 md:p-6">
          <h2 className="profile-block-title">Історія транзакцій</h2>

          <div className="mt-4 inline-flex rounded-full bg-slate-100 p-1">
            <button
              type="button"
              className={`profile-tab ${activeTab === 'received' ? 'profile-tab-active' : ''}`}
              onClick={() => setActiveTab('received')}
            >
              Отримані
            </button>
            <button
              type="button"
              className={`profile-tab ${activeTab === 'given' ? 'profile-tab-active' : ''}`}
              onClick={() => setActiveTab('given')}
            >
              Віддані
            </button>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[760px] text-left text-sm text-slate-700">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Дата</th>
                  <th className="px-4 py-3">Від кого</th>
                  <th className="px-4 py-3">Кому</th>
                  <th className="px-4 py-3">Тип гему</th>
                  <th className="px-4 py-3">Кількість</th>
                  <th className="px-4 py-3">Коментар</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-slate-100 transition hover:bg-sky-50/60">
                    <td className="px-4 py-3">{transaction.date}</td>
                    <td className="px-4 py-3">{transaction.from}</td>
                    <td className="px-4 py-3">{transaction.to}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${badgeClassByGem[transaction.gem] ?? 'bg-slate-200 text-slate-900'}`}
                      >
                        <span className="text-[10px]">●</span>
                        {transaction.gem}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold">{transaction.quantity}</td>
                    <td className="px-4 py-3">{transaction.comment}</td>
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
