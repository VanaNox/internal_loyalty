'use client';

import { colleagues } from '@/lib/data';
import { Header } from '@/components/header';
import { useEffect, useMemo, useRef, useState } from 'react';
import Gem, { type GemProps } from '@/components/Gem';

type GemOption = {
  name: 'Managerial' | 'We Care' | 'Better Together' | 'Game Changer';
  type: GemProps['type'];
};

const GEM_OPTIONS: GemOption[] = [
  { name: 'Managerial', type: 'gold' },
  { name: 'We Care', type: 'ruby' },
  { name: 'Better Together', type: 'emerald' },
  { name: 'Game Changer', type: 'sapphire' }
];

export default function TransferPage() {
  const [query, setQuery] = useState('');
  const [selectedColleague, setSelectedColleague] = useState('');
  const [colleagueOpen, setColleagueOpen] = useState(false);

  const [selectedGem, setSelectedGem] = useState<GemOption['name']>(GEM_OPTIONS[0].name);
  const [gemOpen, setGemOpen] = useState(false);

  const colleagueBoxRef = useRef<HTMLDivElement>(null);
  const gemBoxRef = useRef<HTMLDivElement>(null);

  const filteredColleagues = useMemo(() => {
    const sorted = [...colleagues].sort((a, b) => a.localeCompare(b));
    const normalized = query.trim().toLowerCase();
    if (!normalized) return sorted;
    return sorted.filter((name) => name.toLowerCase().includes(normalized));
  }, [query]);

  const selectedGemOption = useMemo(
    () => GEM_OPTIONS.find((item) => item.name === selectedGem) ?? GEM_OPTIONS[0],
    [selectedGem]
  );

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (colleagueBoxRef.current && !colleagueBoxRef.current.contains(target)) {
        setColleagueOpen(false);
      }
      if (gemBoxRef.current && !gemBoxRef.current.contains(target)) {
        setGemOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className="relative min-h-screen text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.12),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.12),transparent_36%),radial-gradient(circle_at_50%_100%,rgba(147,51,234,0.12),transparent_44%),linear-gradient(160deg,#050818,#0a1227_45%,#111634_100%)]" />
        <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(rgba(255,255,255,.35)_0.7px,transparent_0.7px)] [background-size:3px_3px]" />
      </div>

      <Header active="/transfer" />

      <main className="mx-auto w-full max-w-[1650px] px-[calc(2rem+30px)] py-8 lg:px-[calc(3rem+30px)] lg:py-10">
        <section className="mx-auto w-full max-w-[900px] rounded-2xl border border-white/10 bg-white/[0.055] p-8 backdrop-blur-xl shadow-[0_18px_48px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] lg:p-10">
          <h1 className="mb-8 text-center text-3xl font-semibold tracking-tight text-slate-100">Send a Gem</h1>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2" ref={colleagueBoxRef}>
              <span className="text-sm text-slate-300">Select Colleague</span>
              <input
                value={query || selectedColleague}
                onChange={(e) => {
                  setSelectedColleague('');
                  setQuery(e.target.value);
                  setColleagueOpen(true);
                }}
                onFocus={() => setColleagueOpen(true)}
                className="transfer-field w-full rounded-xl border border-slate-400/30 bg-[#0f1a3e]/92 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:border-sky-300/45 focus:outline-none focus:ring-2 focus:ring-sky-300/20"
                placeholder="Select colleague"
              />
              {colleagueOpen && (
                <div className="transfer-dropdown max-h-44 overflow-auto rounded-xl border border-slate-400/30 bg-[#0b1433]/97 p-2 text-left shadow-[0_14px_34px_rgba(3,8,24,0.55)]">
                  {filteredColleagues.length > 0 ? (
                    filteredColleagues.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSelectedColleague(item);
                          setQuery('');
                          setColleagueOpen(false);
                          setGemOpen(false);
                        }}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/10"
                      >
                        {item}
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-sm text-slate-400">No matches</p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2" ref={gemBoxRef}>
              <span className="text-sm text-slate-300">Gem Type</span>
              <button
                type="button"
                onClick={() => setGemOpen((prev) => !prev)}
                className="transfer-field w-full rounded-xl border border-slate-400/30 bg-[#0f1a3e]/92 px-4 py-3 text-left text-slate-100 focus:border-sky-300/45 focus:outline-none focus:ring-2 focus:ring-sky-300/20"
              >
                <span className="flex items-center gap-3">
                  <Gem type={selectedGemOption.type} size="sm" animated={false} />
                  <span>{selectedGemOption.name}</span>
                </span>
              </button>
              {gemOpen && (
                <div className="transfer-dropdown max-h-44 overflow-auto rounded-xl border border-slate-400/30 bg-[#0b1433]/97 p-2 text-left shadow-[0_14px_34px_rgba(3,8,24,0.55)]">
                  {GEM_OPTIONS.map((gem) => (
                    <button
                      key={gem.name}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setSelectedGem(gem.name);
                        setGemOpen(false);
                        setColleagueOpen(false);
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/10"
                    >
                      <span className="flex items-center gap-3">
                        <Gem type={gem.type} size="sm" animated={false} />
                        <span>{gem.name}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <label className="mt-[51px] block space-y-2">
            <span className="text-sm text-slate-300">And few warm words</span>
            <textarea className="transfer-field h-32 w-full rounded-xl border border-slate-400/30 bg-[#0f1a3e]/92 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:border-sky-300/45 focus:outline-none focus:ring-2 focus:ring-sky-300/20" />
          </label>

          <button className="mx-auto mt-6 flex h-12 min-w-56 items-center justify-center rounded-xl bg-sky-500 px-8 text-base font-semibold text-slate-950 transition hover:bg-sky-400">
            Send a Gem
          </button>
        </section>
      </main>
    </div>
  );
}
