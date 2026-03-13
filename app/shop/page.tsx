'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { REWARDS, USER_BALANCE } from './mockData';
import {
  GemBalanceSummary,
  RewardDetailModal,
  RewardGrid,
  StoreHeader
} from './components/store-components';
import type { RewardItem } from './types';

function StorePage() {
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);

  return (
    <div className='relative min-h-screen text-slate-100'>
      <div className='pointer-events-none fixed inset-0 -z-10'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.12),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.12),transparent_36%),radial-gradient(circle_at_50%_100%,rgba(147,51,234,0.12),transparent_44%),linear-gradient(160deg,#050818,#0a1227_45%,#111634_100%)]' />
        <div className='absolute inset-0 opacity-[0.14] [background-image:radial-gradient(rgba(255,255,255,.35)_0.7px,transparent_0.7px)] [background-size:3px_3px]' />
      </div>

      <Header active='/shop' />

      <main className='mx-auto w-full max-w-[1650px] space-y-6 px-[calc(2rem+30px)] py-8 lg:space-y-7 lg:px-[calc(3rem+30px)] lg:py-10'>
        <StoreHeader />
        <GemBalanceSummary balance={USER_BALANCE} />
        <RewardGrid rewards={REWARDS} balance={USER_BALANCE} onOpen={setSelectedReward} />
      </main>

      <RewardDetailModal
        reward={selectedReward}
        balance={USER_BALANCE}
        isOpen={Boolean(selectedReward)}
        onClose={() => setSelectedReward(null)}
      />
    </div>
  );
}

export default StorePage;


