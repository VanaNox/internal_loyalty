'use client';

import { useEffect, useMemo, useState } from 'react';
import { Crown, Send, Wallet } from 'lucide-react';
import Gem, { type GemProps } from '@/components/Gem';

type Direction = 'sent' | 'received';
type GemType = 'Managerial' | 'We Care' | 'Better Together' | 'Game Changer';

type ReceivedGem = {
  label: GemType;
  count: number;
  gemType: GemProps['type'];
  microcopy: string;
};

type HistoryRow = {
  id: string;
  date: string;
  from: string;
  to: string;
  gemType: GemType;
  comment: string;
  direction: Direction;
};

const RESET_BASE_MS = Date.parse('2026-03-22T21:00:00+02:00');
const BIWEEK_MS = 14 * 24 * 60 * 60 * 1000;

const NAV_ITEMS = [
  { href: '/profile', label: 'Profile' },
  { href: '/transfer', label: 'Send a Gem' },
  { href: '/shop', label: 'Store' }
] as const;

const RECEIVED_GEMS: ReceivedGem[] = [
  { label: 'Managerial', count: 4, gemType: 'gold', microcopy: 'Leadership moments' },
  { label: 'We Care', count: 6, gemType: 'ruby', microcopy: 'Support and empathy' },
  { label: 'Better Together', count: 3, gemType: 'emerald', microcopy: 'Team collaboration' },
  { label: 'Game Changer', count: 2, gemType: 'sapphire', microcopy: 'Breakthrough impact' }
];

const HISTORY_ROWS: HistoryRow[] = [
  { id: 's-01', date: '2026-03-20', from: 'Kateryna D.', to: 'Andrii M.', gemType: 'Managerial', comment: 'Great ownership during critical release coordination.', direction: 'sent' },
  { id: 's-02', date: '2026-03-19', from: 'Kateryna D.', to: 'Iryna S.', gemType: 'We Care', comment: 'Thanks for helping onboard new teammates smoothly.', direction: 'sent' },
  { id: 's-03', date: '2026-03-18', from: 'Kateryna D.', to: 'Taras Y.', gemType: 'Better Together', comment: 'Excellent collaboration across teams this sprint.', direction: 'sent' },
  { id: 's-04', date: '2026-03-17', from: 'Kateryna D.', to: 'Olha K.', gemType: 'Game Changer', comment: 'Your prototype improved performance and clarity.', direction: 'sent' },
  { id: 's-05', date: '2026-03-16', from: 'Kateryna D.', to: 'Maks P.', gemType: 'We Care', comment: 'Appreciate your support during incident response.', direction: 'sent' },
  { id: 's-06', date: '2026-03-15', from: 'Kateryna D.', to: 'Yevhen K.', gemType: 'Managerial', comment: 'Strong prioritization kept delivery on track.', direction: 'sent' },
  { id: 'r-01', date: '2026-03-14', from: 'Marina L.', to: 'Kateryna D.', gemType: 'Game Changer', comment: 'Your feedback unlocked a cleaner architecture.', direction: 'received' },
  { id: 'r-02', date: '2026-03-13', from: 'Andrii M.', to: 'Kateryna D.', gemType: 'Better Together', comment: 'Great teamwork during urgent production recovery.', direction: 'received' },
  { id: 'r-03', date: '2026-03-12', from: 'Iryna S.', to: 'Kateryna D.', gemType: 'We Care', comment: 'Thanks for mentoring me through blockers.', direction: 'received' },
  { id: 'r-04', date: '2026-03-11', from: 'Taras Y.', to: 'Kateryna D.', gemType: 'Managerial', comment: 'Leadership support helped finish milestones early.', direction: 'received' },
  { id: 'r-05', date: '2026-03-10', from: 'Olha K.', to: 'Kateryna D.', gemType: 'Game Changer', comment: 'Your idea increased dashboard usability significantly.', direction: 'received' },
  { id: 'r-06', date: '2026-03-09', from: 'Maks P.', to: 'Kateryna D.', gemType: 'Better Together', comment: 'Collaboration made our release process smoother.', direction: 'received' }
];

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function nextResetMs(nowMs: number) {
  if (nowMs < RESET_BASE_MS) return RESET_BASE_MS;
  const periods = Math.floor((nowMs - RESET_BASE_MS) / BIWEEK_MS) + 1;
  return RESET_BASE_MS + periods * BIWEEK_MS;
}

function countdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60
  };
}

function pad2(value: number) {
  return String(value).padStart(2, '0');
}

const GEM_PILL_THEME: Record<GemType, string> = {
  Managerial: 'text-amber-200 bg-amber-400/20 border-amber-300/35',
  'We Care': 'text-pink-200 bg-pink-400/20 border-pink-300/35',
  'Better Together': 'text-emerald-200 bg-emerald-400/20 border-emerald-300/35',
  'Game Changer': 'text-cyan-200 bg-cyan-400/20 border-cyan-300/35'
};

const GEM_TYPE_MAP: Record<GemType, GemProps['type']> = {
  Managerial: 'gold',
  'We Care': 'ruby',
  'Better Together': 'emerald',
  'Game Changer': 'sapphire'
};

function GemToken({
  type,
  size = 'md',
  animated = true,
  muted = false
}: {
  type: GemProps['type'];
  size?: GemProps['size'];
  animated?: boolean;
  muted?: boolean;
}) {
  const shellSize = size === 'sm' ? 'size-11' : size === 'lg' ? 'size-[4.75rem]' : 'size-14';

  return (
    <div
      className={cn(
        'relative grid place-items-center rounded-full bg-white/[0.06] p-[2px] ring-1 ring-white/14 shadow-[0_10px_28px_rgba(4,7,20,0.42)]',
        shellSize,
        muted && 'opacity-55 saturate-75'
      )}
    >
      <div className="grid size-full place-items-center rounded-full bg-[#0d1736]/90">
        <Gem type={type} size={size} animated={animated} />
      </div>
    </div>
  );
}

function SurfaceCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-white/10 bg-white/[0.055] backdrop-blur-xl',
        'shadow-[0_18px_48px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]',
        className
      )}
    >
      {children}
    </section>
  );
}

function TopNavigation() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070d21]/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1650px] items-center justify-between px-7 py-3 lg:px-12">
        <a href="/profile" className="text-3xl font-semibold tracking-tight text-slate-100">
          GemPulse
        </a>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition',
                item.href === '/profile'
                  ? 'bg-sky-500/16 text-sky-100 ring-1 ring-sky-300/35'
                  : 'hover:bg-white/8 hover:text-slate-100'
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="/" className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/10">
          Exit
        </a>
      </div>
    </header>
  );
}

function ProfileHero() {
  return (
    <SurfaceCard className="p-6 lg:p-7">
      <div className="flex items-center gap-4">
        <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 text-2xl font-semibold text-slate-900 shadow-lg shadow-amber-500/30">
          KD
        </div>
        <div>
          <p className="text-3xl font-semibold tracking-tight text-slate-50">Kateryna D.</p>
          <p className="mt-1 text-sm text-slate-400">kateryea48@company.com</p>
        </div>
      </div>
    </SurfaceCard>
  );
}

function ReceivedGemsCard({ gems }: { gems: ReceivedGem[] }) {
  const total = gems.reduce((sum, item) => sum + item.count, 0);

  return (
    <SurfaceCard className="flex h-full flex-col p-5 lg:p-6">
      <div className="mb-4 flex min-h-[56px] items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="grid size-8 place-items-center rounded-lg bg-slate-700/60 text-slate-200">
            <Wallet size={15} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">My Spending Wallet</h2>
            <p className="mt-1 text-sm text-slate-400">Gems earned and ready to redeem</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Total</p>
          <p className="text-4xl font-semibold leading-none text-slate-50">{total}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {gems.map((gem) => (
          <article
            key={gem.label}
            className="flex h-full min-h-[132px] flex-col rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:bg-white/[0.06]"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="max-w-[10ch] text-sm font-medium leading-[1.2] text-slate-200">{gem.label}</p>
              <GemToken type={gem.gemType} size="sm" />
            </div>
            <p className="text-3xl font-semibold leading-none text-slate-50">{gem.count}</p>
            <p className="mt-1 text-xs text-slate-400">{gem.microcopy}</p>
          </article>
        ))}
      </div>

      <a
        href="/shop"
        className="mx-auto mt-auto inline-flex min-w-[330px] items-center justify-center rounded-xl border border-amber-300/35 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-100 transition hover:bg-amber-400/20"
      >
        Check items available
      </a>
    </SurfaceCard>
  );
}

function SprintGivingCard({ countdownValue }: { countdownValue: { d: number; h: number; m: number; s: number } }) {
  return (
    <SurfaceCard className="flex h-full flex-col p-5 lg:p-6">
      <div className="mb-4 flex min-h-[56px] items-start gap-3">
        <div className="grid size-8 place-items-center rounded-lg bg-slate-700/60 text-slate-200">
          <Send size={15} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Sprint Giving Wallet</h2>
          <p className="mt-1 text-sm text-slate-400">Bi-weekly transparent gems</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 2 }).map((_, idx) => (
          <a
            key={`ready-${idx}`}
            href="/transfer"
            className="group rounded-xl border border-dashed border-slate-500/50 bg-slate-900/25 px-3 py-4 transition hover:border-slate-300/65 hover:bg-slate-800/45"
          >
            <div className="grid place-items-center gap-2">
              <GemToken type="sapphire" size="sm" muted />
              <p className="text-sm font-medium text-slate-300 group-hover:text-slate-100">Ready to give</p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-auto pt-4">
        <div className="rounded-xl border border-white/10 bg-gradient-to-r from-indigo-400/12 to-cyan-300/8 p-3">
          <p className="text-sm text-slate-300">Time until Sunday 21:00 Reset</p>
          <p className="mt-1 flex flex-wrap gap-3 text-[1.1rem] font-semibold text-slate-100">
            <span>{pad2(countdownValue.d)} d</span>
            <span>{pad2(countdownValue.h)} h</span>
            <span>{pad2(countdownValue.m)} m</span>
            <span>{pad2(countdownValue.s)} s</span>
          </p>
        </div>
      </div>
    </SurfaceCard>
  );
}

function ManagerialCard() {
  return (
    <SurfaceCard className="flex h-full flex-col p-5 lg:p-6">
      <div className="mb-4 flex min-h-[56px] items-start gap-3">
        <div className="grid size-8 place-items-center rounded-lg bg-amber-500/25 text-amber-200">
          <Crown size={15} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Managerial gems</h2>
          <p className="mt-1 text-sm text-slate-400">For your direct reports</p>
        </div>
      </div>

      <div className="mt-4 grid flex-1 place-items-center">
        <div className="relative">
          <GemToken type="gold" size="lg" />
          <span className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full bg-amber-500 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/35">
            4
          </span>
        </div>
      </div>

      <a
        href="/transfer"
        className="mt-4 inline-flex items-center justify-center rounded-xl border border-amber-300/35 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-100 transition hover:bg-amber-400/20"
      >
        Give leadership recognition
      </a>
    </SurfaceCard>
  );
}

function GemPill({ type }: { type: GemType }) {
  return (
    <span className={cn('inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium', GEM_PILL_THEME[type])}>
      <span className="grid size-5 place-items-center overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15">
        <span className="scale-[0.46]">
          <Gem type={GEM_TYPE_MAP[type]} size="sm" animated={false} />
        </span>
      </span>
      {type}
    </span>
  );
}

function HistorySection({ rows, activeTab, onTab }: { rows: HistoryRow[]; activeTab: Direction; onTab: (tab: Direction) => void }) {
  return (
    <SurfaceCard className="flex h-full flex-col p-5 lg:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-4xl font-semibold tracking-tight text-slate-100">History</h2>
        <div className="inline-flex rounded-xl bg-slate-800/60 p-1">
          <button
            type="button"
            onClick={() => onTab('sent')}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition',
              activeTab === 'sent' ? 'bg-slate-100 text-slate-900' : 'text-slate-300 hover:bg-white/10 hover:text-white'
            )}
          >
            Sent
          </button>
          <button
            type="button"
            onClick={() => onTab('received')}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition',
              activeTab === 'received' ? 'bg-slate-100 text-slate-900' : 'text-slate-300 hover:bg-white/10 hover:text-white'
            )}
          >
            Received
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/35">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 text-xs uppercase tracking-[0.08em] text-slate-400">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">To</th>
              <th className="px-4 py-3 font-medium">Gem Type</th>
              <th className="px-4 py-3 font-medium">Comment</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-white/10 text-sm text-slate-200 transition hover:bg-white/[0.03]">
                <td className="px-4 py-3 text-slate-300">{row.date}</td>
                <td className="px-4 py-3">{row.from}</td>
                <td className="px-4 py-3">{row.to}</td>
                <td className="px-4 py-3">
                  <GemPill type={row.gemType} />
                </td>
                <td className="px-4 py-3 text-slate-300">{row.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SurfaceCard>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Direction>('sent');
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const visibleRows = useMemo(() => HISTORY_ROWS.filter((row) => row.direction === activeTab), [activeTab]);
  const resetIn = useMemo(() => countdown(nextResetMs(nowMs) - nowMs), [nowMs]);

  return (
    <div className="relative min-h-screen text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.12),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.12),transparent_36%),radial-gradient(circle_at_50%_100%,rgba(147,51,234,0.12),transparent_44%),linear-gradient(160deg,#050818,#0a1227_45%,#111634_100%)]" />
        <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(rgba(255,255,255,.35)_0.7px,transparent_0.7px)] [background-size:3px_3px]" />
      </div>

      <TopNavigation />

      <main className="mx-auto w-full max-w-[1650px] px-[calc(2rem+30px)] py-8 lg:px-[calc(3rem+30px)] lg:py-10">
        <div className="space-y-7">
          <ProfileHero />

          <section className="grid items-stretch gap-6 xl:grid-cols-[1.6fr_0.95fr_0.7fr]">
            <div className="h-full">
              <ReceivedGemsCard gems={RECEIVED_GEMS} />
            </div>
            <div className="h-full">
              <SprintGivingCard countdownValue={resetIn} />
            </div>
            <div className="h-full">
              <ManagerialCard />
            </div>
          </section>

          <HistorySection rows={visibleRows} activeTab={activeTab} onTab={setActiveTab} />
        </div>
      </main>
    </div>
  );
}
