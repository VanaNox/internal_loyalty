'use client';

import Link from 'next/link';
import { Header } from '@/components/header';
import { useEffect, useMemo, useState } from 'react';

type ReceivedGem = {
  name: string;
  value: number;
  ring: string;
  crystal: string;
  tone: string;
};

type HistoryItem = {
  date: string;
  from: string;
  to: string;
  type: string;
  note: string;
  direction: 'sent' | 'received';
};

const receivedGems: ReceivedGem[] = [
  { name: 'Yellow', value: 4, ring: 'gem-ring-yellow', crystal: 'gem-crystal-yellow', tone: 'gem-tone-yellow' },
  { name: 'We Care', value: 6, ring: 'gem-ring-pink', crystal: 'gem-crystal-pink', tone: 'gem-tone-pink' },
  { name: 'Better Together', value: 3, ring: 'gem-ring-green', crystal: 'gem-crystal-green', tone: 'gem-tone-green' },
  { name: 'Gamechanger', value: 2, ring: 'gem-ring-blue', crystal: 'gem-crystal-blue', tone: 'gem-tone-blue' }
];

const historyRows: HistoryItem[] = [
  { date: '2026-03-20', from: 'Kateryna D.', to: 'Andrii M.', type: 'Managerial', note: 'Great ownership during critical release coordination.', direction: 'sent' },
  { date: '2026-03-19', from: 'Kateryna D.', to: 'Iryna S.', type: 'We Care', note: 'Thanks for helping onboard new teammates smoothly.', direction: 'sent' },
  { date: '2026-03-18', from: 'Kateryna D.', to: 'Taras Y.', type: 'Better Together', note: 'Excellent collaboration across teams this sprint.', direction: 'sent' },
  { date: '2026-03-17', from: 'Kateryna D.', to: 'Olha K.', type: 'Gamechanger', note: 'Your prototype improved performance and clarity.', direction: 'sent' },
  { date: '2026-03-16', from: 'Kateryna D.', to: 'Maks P.', type: 'We Care', note: 'Appreciate your support during incident response.', direction: 'sent' },
  { date: '2026-03-15', from: 'Kateryna D.', to: 'Yevhen K.', type: 'Managerial', note: 'Strong prioritization kept delivery on track.', direction: 'sent' },
  { date: '2026-03-14', from: 'Marina L.', to: 'Kateryna D.', type: 'Gamechanger', note: 'Your feedback unlocked a cleaner architecture.', direction: 'received' },
  { date: '2026-03-13', from: 'Andrii M.', to: 'Kateryna D.', type: 'Better Together', note: 'Great teamwork during urgent production recovery.', direction: 'received' },
  { date: '2026-03-12', from: 'Iryna S.', to: 'Kateryna D.', type: 'We Care', note: 'Thanks for mentoring me through blockers.', direction: 'received' },
  { date: '2026-03-11', from: 'Taras Y.', to: 'Kateryna D.', type: 'Managerial', note: 'Leadership support helped finish milestones early.', direction: 'received' },
  { date: '2026-03-10', from: 'Olha K.', to: 'Kateryna D.', type: 'Gamechanger', note: 'Your idea increased dashboard usability significantly.', direction: 'received' },
  { date: '2026-03-09', from: 'Maks P.', to: 'Kateryna D.', type: 'Better Together', note: 'Collaboration made our release process smoother.', direction: 'received' }
];

const RESET_BASE_UTC_MS = Date.parse('2026-03-22T19:00:00Z');
const BIWEEK_MS = 14 * 24 * 60 * 60 * 1000;

function getNextResetMs(nowMs: number) {
  if (nowMs < RESET_BASE_UTC_MS) return RESET_BASE_UTC_MS;
  const windowsPassed = Math.floor((nowMs - RESET_BASE_UTC_MS) / BIWEEK_MS) + 1;
  return RESET_BASE_UTC_MS + windowsPassed * BIWEEK_MS;
}

function toCountdownParts(diffMs: number) {
  const safe = Math.max(0, diffMs);
  const totalSec = Math.floor(safe / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds };
}

function pad2(value: number) {
  return String(value).padStart(2, '0');
}

function GemCrystal({ crystalClass }: { crystalClass: string }) {
  return (
    <svg className={`profile-ref-crystal ${crystalClass}`} viewBox="0 0 44 44" aria-hidden="true">
      <path d="M8 13h28l4 8-18 20L4 21l4-8Z" fill="currentColor" opacity="0.95" />
      <path d="M8 13h28l-14 8-14-8Z" fill="rgba(255,255,255,.62)" />
      <path d="M4 21h36M22 13v28M14 13l8 8 8-8" stroke="rgba(255,255,255,.55)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function gemPillClass(type: string) {
  if (type === 'Managerial') return 'amber';
  if (type === 'We Care') return 'pink';
  if (type === 'Better Together') return 'green';
  return 'blue';
}

export default function ProfilePage() {
  const [tab, setTab] = useState<'sent' | 'received'>('sent');
  const [nowMs, setNowMs] = useState(() => Date.now());
  const visibleRows = useMemo(() => historyRows.filter((row) => row.direction === tab), [tab]);
  const receivedTotal = receivedGems.reduce((sum, gem) => sum + gem.value, 0);
  const nextResetMs = useMemo(() => getNextResetMs(nowMs), [nowMs]);
  const countdown = useMemo(() => toCountdownParts(nextResetMs - nowMs), [nextResetMs, nowMs]);

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <Header active="/profile" />
      <main className="profile-ref-shell mx-auto w-full max-w-none py-4 md:py-5">
        <section className="profile-ref-user-card">
          <div className="profile-ref-user-avatar">KD</div>
          <div>
            <p className="profile-ref-user-name">Kateryna D.</p>
            <p className="profile-ref-user-email">kateryea48 company com</p>
          </div>
        </section>

        <section className="gems-triple-layout" aria-label="Gem wallets">
          <article className="gems-wallet-card">
            <header className="gems-wallet-head">
              <div>
                <h2 className="gems-wallet-title">Received gems</h2>
                <p className="gems-wallet-subtitle">4 types from other users</p>
              </div>
              <p className="gems-wallet-total">{receivedTotal}</p>
            </header>

            <div className="gems-received-grid">
              {receivedGems.map((gem) => (
                <article key={gem.name} className={`gems-received-item ${gem.tone}`}>
                  <div>
                    <p className="gems-received-name">{gem.name}</p>
                  </div>
                  <div className="gems-counter-core">
                    <div className={`profile-ref-orb ${gem.ring}`}>
                      <GemCrystal crystalClass={gem.crystal} />
                    </div>
                    <span className="gems-counter-badge">{gem.value}</span>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="gems-wallet-card gems-sprint-card">
            <header className="gems-wallet-head">
              <div>
                <h2 className="gems-wallet-title">Sprint Giving Wallet</h2>
                <p className="gems-wallet-subtitle">Bi-weekly transparent gems</p>
              </div>
            </header>

            <div className="gems-transparent-grid">
              <Link href="/transfer" className="gems-transparent-slot is-unused">
                <div className="profile-ref-orb gem-ring-ice is-unused">
                  <GemCrystal crystalClass="gem-crystal-ice" />
                </div>
                <p>Ready to give</p>
              </Link>
              <Link href="/transfer" className="gems-transparent-slot is-unused">
                <div className="profile-ref-orb gem-ring-ice is-unused">
                  <GemCrystal crystalClass="gem-crystal-ice" />
                </div>
                <p>Ready to give</p>
              </Link>
            </div>

            <div className="gems-reset-timer" aria-live="polite">
              <p className="gems-reset-title">Time until Sunday 21:00 Reset</p>
              <p className="gems-reset-value">
                <span>{pad2(countdown.days)} d</span>
                <span>{pad2(countdown.hours)} h</span>
                <span>{pad2(countdown.minutes)} m</span>
                <span>{pad2(countdown.seconds)} s</span>
              </p>
            </div>
          </article>

          <article className="gems-wallet-card gems-managerial-card">
            <header className="gems-wallet-head">
              <div>
                <h2 className="gems-wallet-title">Managerial gems</h2>
                <p className="gems-wallet-subtitle">Leadership recognition</p>
              </div>
            </header>

            <div className="gems-managerial-core">
              <div className="profile-ref-orb gem-ring-amber">
                <GemCrystal crystalClass="gem-crystal-yellow" />
              </div>
              <span className="gems-managerial-badge">4</span>
            </div>
          </article>
        </section>

        <section className="profile-ref-history">
          <h3 className="profile-ref-history-title">History</h3>
          <div className="profile-ref-history-tabs">
            <button type="button" className={`profile-ref-tab ${tab === 'sent' ? 'active' : ''}`} onClick={() => setTab('sent')}>
              Sent
            </button>
            <button type="button" className={`profile-ref-tab ${tab === 'received' ? 'active' : ''}`} onClick={() => setTab('received')}>
              Received
            </button>
          </div>
          <div className="profile-ref-table-wrap">
            <table className="profile-ref-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Gem type</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={`${row.date}-${row.from}-${row.type}`}>
                    <td>{row.date}</td>
                    <td>{row.from}</td>
                    <td>{row.to}</td>
                    <td>
                      <span className={`profile-ref-pill ${gemPillClass(row.type)}`}>{row.type}</span>
                    </td>
                    <td>{row.note}</td>
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