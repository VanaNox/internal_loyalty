'use client';

import { colleagues, gems } from '@/lib/data';
import { Header } from '@/components/header';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function TransferPage() {
  const [query, setQuery] = useState('');
  const [selectedColleague, setSelectedColleague] = useState('');
  const [colleagueOpen, setColleagueOpen] = useState(false);

  const [selectedGem, setSelectedGem] = useState(gems[0]?.name ?? '');
  const [gemOpen, setGemOpen] = useState(false);

  const colleagueBoxRef = useRef<HTMLDivElement>(null);
  const gemBoxRef = useRef<HTMLDivElement>(null);

  const filteredColleagues = useMemo(() => {
    const sorted = [...colleagues].sort((a, b) => a.localeCompare(b));
    const normalized = query.trim().toLowerCase();
    if (!normalized) return sorted;
    return sorted.filter((name) => name.toLowerCase().includes(normalized));
  }, [query]);

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
    <>
      <Header active="/transfer" />
      <main className="mx-auto flex w-full max-w-6xl justify-center px-4 py-8 md:px-6">
        <section className="glass w-full max-w-3xl p-8">
          <h1 className="mb-8 text-center text-3xl font-semibold">Send a Gem</h1>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 text-center" ref={colleagueBoxRef}>
              <span className="text-sm text-slate-300">Select Colleague</span>
              <input
                value={query || selectedColleague}
                onChange={(e) => {
                  setSelectedColleague('');
                  setQuery(e.target.value);
                  setColleagueOpen(true);
                }}
                onFocus={() => setColleagueOpen(true)}
                className="w-full rounded-xl border border-white/20 bg-slate-900/70 px-4 py-3"
                placeholder="Select colleague"
              />
              {colleagueOpen && (
                <div className="max-h-44 overflow-auto rounded-xl border border-white/10 bg-slate-900/50 p-2 text-left">
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
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
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

            <div className="space-y-2 text-center" ref={gemBoxRef}>
              <span className="text-sm text-slate-300">Gem Type</span>
              <button
                type="button"
                onClick={() => setGemOpen((prev) => !prev)}
                className="w-full rounded-xl border border-white/20 bg-slate-900/70 px-4 py-3 text-left"
              >
                {selectedGem || 'Select gem type'}
              </button>
              {gemOpen && (
                <div className="max-h-44 overflow-auto rounded-xl border border-white/10 bg-slate-900/50 p-2 text-left">
                  {gems.map((gem) => (
                    <button
                      key={gem.name}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setSelectedGem(gem.name);
                        setGemOpen(false);
                        setColleagueOpen(false);
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                    >
                      {gem.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <label className="mt-[51px] block space-y-2 text-center">
            <span className="text-sm text-slate-300">And few warm words</span>
            <textarea className="h-32 w-full rounded-xl border border-white/20 bg-slate-900/70 px-4 py-3" />
          </label>

          <button className="mx-auto mt-6 flex h-12 min-w-56 items-center justify-center rounded-xl bg-sky-500 px-8 text-base font-semibold text-slate-950 transition hover:bg-sky-400">
            Send a Gem
          </button>
        </section>
      </main>
    </>
  );
}