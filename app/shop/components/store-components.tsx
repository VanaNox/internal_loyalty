'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Gem from '@/components/Gem';
import GemToken from '@/components/gem-token';
import { GEM_META } from '../mockData';
import {
  canAffordRule,
  canDecrement,
  canIncrement,
  gemTypeLabel,
  getAllowedGemTypes,
  getDefaultSelection,  getPriceParts,
  getRequiredTotal,
  getSelectionHelperText,
  sumSelection,
  validateSelection
} from '../storeUtils';
import type { GemBalance, GemType, PricePart, PricingRule, RewardItem, SelectionState } from '../types';

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

const GEM_MICROCOPY: Record<GemType, string> = {
  managerial: 'Leadership moments',
  weCare: 'Support and empathy',
  betterTogether: 'Team collaboration',
  gameChanger: 'Breakthrough impact'
};

function GlassPanel({ children, className }: { children: ReactNode; className?: string }) {
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

function GemFrame({
  gemType,
  size = 'sm',
  opticalCenter = false
}: {
  gemType: GemType;
  size?: 'chip' | 'sm' | 'md';
  opticalCenter?: boolean;
}) {
  const meta = GEM_META[gemType];

  if (opticalCenter) {
    const shellSize = size === 'chip' ? 'size-8' : size === 'md' ? 'size-12' : 'size-11';
    const gemPixelSize =
      size === 'chip'
        ? '[&_.gem-root]:!size-6'
        : size === 'md'
          ? '[&_.gem-root]:!size-8'
          : '[&_.gem-root]:!size-7';

    return (
      <span
        className={cn(
          'relative rounded-full bg-white/[0.06] p-[2px] ring-1 ring-white/14 shadow-[0_10px_28px_rgba(4,7,20,0.42)]',
          shellSize
        )}
      >
        <span className='relative block size-full overflow-hidden rounded-full bg-[#0d1736]/90'>
          <span className={cn('absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', gemPixelSize, '[&_.gem-root]:!filter-none [&_.gem-root]:!transform-none')}>
            <Gem type={meta.gemVisual} size={size === 'md' ? 'md' : 'sm'} animated={false} />
          </span>
        </span>
      </span>
    );
  }

  return <GemToken type={meta.gemVisual} size={size} animated={size !== 'chip'} />;
}
function MiniPlainGem({ gemType, size = 'chip' }: { gemType: GemType; size?: 'chip' | 'sm' }) {
  const gemSizeClass = size === 'chip' ? 'size-7' : 'size-8';
  const scaleClass = size === 'chip' ? 'scale-[0.74]' : 'scale-[0.8]';

  return (
    <span className={cn('flex items-center justify-center', gemSizeClass, '[&_.gem-root]:!filter-none [&_.gem-root]:!transform-none')}>
      <span className={cn('-translate-y-px origin-center', scaleClass)}>
        <Gem type={GEM_META[gemType].gemVisual} size='sm' animated={false} />
      </span>
    </span>
  );
}

export function AnyGemStackIcon({ size = 'chip' }: { size?: 'chip' | 'sm' }) {
  const gemTypes: GemType[] = ['managerial', 'weCare', 'betterTogether', 'gameChanger'];
  const overlapClass = size === 'chip' ? '-ml-1.5' : '-ml-2';

  return (
    <span className='inline-flex items-center'>
      {gemTypes.map((type, index) => (
        <span key={type} className={cn(index === 0 ? '' : overlapClass)}>
          <MiniPlainGem gemType={type} size={size} />
        </span>
      ))}
    </span>
  );
}

function PricePartNode({ part }: { part: PricePart }) {
  if (part.kind === 'any') {
    return (
      <span className='inline-flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/35 px-3 py-1'>
        <AnyGemStackIcon size='chip' />
        <span className='inline-flex items-center gap-1 text-sm font-medium leading-none text-slate-200'>
          <span className='text-base leading-none'>&times;</span>
          <span className='leading-none'>{part.amount}</span>
        </span>
      </span>
    );
  }

  return (
    <span className='inline-flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/35 px-3 py-1'>
      <MiniPlainGem gemType={part.gemType} size='chip' />
      <span className='inline-flex items-center gap-1 text-sm font-medium leading-none text-slate-200'>
        <span className='text-base leading-none'>&times;</span>
        <span className='leading-none'>{part.amount}</span>
      </span>
    </span>
  );
}

export function PriceDisplay({ pricingRule, className }: { pricingRule: PricingRule; className?: string }) {
  const parts = getPriceParts(pricingRule);

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {parts.map((part, index) => (
        <span key={`${part.kind}-${index}`} className='inline-flex items-center gap-2'>
          <PricePartNode part={part} />
          {index < parts.length - 1 ? <span className='text-slate-500'>+</span> : null}
        </span>
      ))}
    </div>
  );
}

export function StoreHeader() {
  return (
    <GlassPanel className='p-6 lg:p-7'>
      <h1 className='text-3xl font-semibold tracking-tight text-slate-100 lg:text-4xl'>Store</h1>
      <p className='mt-1 text-sm text-slate-400 lg:text-base'>Redeem your gems for rewards and experiences.</p>
      <p className='mt-2 text-xs text-slate-500'>Some rewards combine specific gem requirements with flexible any-gem allocation.</p>
    </GlassPanel>
  );
}

export function GemBalanceSummary({ balance }: { balance: GemBalance }) {
  const gemTypes: GemType[] = ['managerial', 'weCare', 'betterTogether', 'gameChanger'];

  return (
    <GlassPanel className='p-5 lg:p-6'>
      <div className='mb-4 flex items-end justify-between gap-4'>
        <div>
          <h2 className='text-lg font-semibold text-slate-100'>Your Gem Balance</h2>
          <p className='mt-1 text-sm text-slate-400'>Use these balances to configure your purchase.</p>
        </div>
        <p className='text-xs uppercase tracking-[0.14em] text-slate-500'>Wallet</p>
      </div>

      <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        {gemTypes.map((gemType) => (
          <article
            key={gemType}
            className='flex h-full min-h-[132px] flex-col rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:bg-white/[0.06]'
          >
            <div className='mb-3 flex items-center justify-between gap-2'>
              <p className='max-w-[10ch] text-sm font-medium leading-[1.2] text-slate-200'>{GEM_META[gemType].label}</p>
              <GemFrame gemType={gemType} size='sm' />
            </div>
            <p className='text-3xl font-semibold leading-none text-slate-50'>{balance[gemType]}</p>
            <p className='mt-1 text-xs text-slate-400'>{GEM_MICROCOPY[gemType]}</p>
          </article>
        ))}
      </div>
    </GlassPanel>
  );
}

export function RewardCard({
  reward,
  balance,
  onOpen
}: {
  reward: RewardItem;
  balance: GemBalance;
  onOpen: (reward: RewardItem) => void;
}) {
  const affordable = canAffordRule(reward.pricingRule, balance);

  return (
    <button
      type='button'
      onClick={() => onOpen(reward)}
      className={cn(
        'group h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left transition duration-200',
        'shadow-[0_10px_28px_rgba(0,0,0,0.28)] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-[0_18px_36px_rgba(7,14,32,0.45)]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300'
      )}
      aria-label={`Open details for ${reward.title}`}
    >
      <div className='relative h-44 overflow-hidden bg-[#0b162f]'>
        <img
          src={reward.image}
          alt={reward.title}
          className='h-full w-full object-cover transition duration-500 [transform:translateZ(0)] group-hover:scale-[1.03]'
        />
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071328]/60 via-transparent to-transparent' />
        <div className='pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10' />
      </div>

      <div className='flex h-[calc(100%-11rem)] flex-col p-4'>
        <h3 className='text-lg font-semibold leading-tight text-slate-100'>{reward.title}</h3>
        <p className='mt-1 line-clamp-2 text-sm text-slate-400'>{reward.shortDescription}</p>

        <div className='mt-auto flex flex-col items-center pt-4'>
          <PriceDisplay pricingRule={reward.pricingRule} className='w-full justify-center' />
          <p className={cn('mt-3 w-full text-center text-xs', affordable ? 'text-emerald-300/90' : 'text-amber-200/90')}>
            {affordable ? 'Available with your current balance' : 'Not enough gems yet'}
          </p>
        </div>
      </div>
    </button>
  );
}

export function RewardGrid({
  rewards,
  balance,
  onOpen
}: {
  rewards: RewardItem[];
  balance: GemBalance;
  onOpen: (reward: RewardItem) => void;
}) {
  return (
    <section className='grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
      {rewards.map((reward) => (
        <RewardCard key={reward.id} reward={reward} balance={balance} onOpen={onOpen} />
      ))}
    </section>
  );
}

export function GemSelectorRow({
  gemType,
  available,
  selected,
  disabled,
  canPlus,
  canMinus,
  onPlus,
  onMinus
}: {
  gemType: GemType;
  available: number;
  selected: number;
  disabled: boolean;
  canPlus: boolean;
  canMinus: boolean;
  onPlus: () => void;
  onMinus: () => void;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5',
        disabled ? 'border-slate-700/50 bg-slate-900/30 opacity-55' : 'border-white/10 bg-white/[0.03]'
      )}
    >
      <div className='flex min-w-0 items-center gap-3'>
        <GemFrame gemType={gemType} size='chip' opticalCenter />
        <div className='min-w-0'>
          <p className='truncate text-sm font-medium text-slate-200'>{gemTypeLabel(gemType)}</p>
          <p className='text-xs text-slate-400'>Available: {available}</p>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <button
          type='button'
          onClick={onMinus}
          disabled={!canMinus || disabled}
          className='grid size-8 place-items-center rounded-md border border-white/15 bg-slate-900/45 text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35'
          aria-label={`Decrease ${gemTypeLabel(gemType)} selection`}
        >
          -
        </button>

        <span className='min-w-8 text-center text-sm font-semibold text-slate-100'>{selected}</span>

        <button
          type='button'
          onClick={onPlus}
          disabled={!canPlus || disabled}
          className='grid size-8 place-items-center rounded-md border border-white/15 bg-slate-900/45 text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35'
          aria-label={`Increase ${gemTypeLabel(gemType)} selection`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export function PurchaseSummary({ pricingRule, selection, balance }: { pricingRule: PricingRule; selection: SelectionState; balance: GemBalance }) {
  const validation = validateSelection(pricingRule, balance, selection);
  const totalSelected = sumSelection(selection);
  const totalRequired = getRequiredTotal(pricingRule);

  return (
    <div className='rounded-xl border border-white/10 bg-slate-900/35 p-3'>
      <p className='text-xs uppercase tracking-[0.08em] text-slate-500'>Purchase Summary</p>

      <div className='mt-2 space-y-1 text-sm'>
        <div>
          <span className='text-slate-400'>Required:</span>
          <PriceDisplay pricingRule={pricingRule} className='mt-1' />
        </div>

        {pricingRule.type === 'specific_plus_any' ? (
          <>
            <p className='text-slate-300'>
              Fixed complete: {Math.min(selection[pricingRule.specificGemType], pricingRule.specificAmount)} / {pricingRule.specificAmount}{' '}
              {gemTypeLabel(pricingRule.specificGemType)}
            </p>
            <p className='text-slate-300'>
              Any selected: {validation.selectedAny} / {validation.requiredAny}
            </p>
          </>
        ) : (
          <p className='text-slate-300'>
            Selected: {totalSelected} / {totalRequired}
          </p>
        )}

        <p className={cn('text-sm', validation.isComplete ? 'text-emerald-300' : 'text-amber-200')}>
          {validation.isComplete ? 'Complete' : `Remaining: ${validation.missingTotal}`}
        </p>
      </div>
    </div>
  );
}

export function CTAButton({ isActive }: { isActive: boolean }) {
  return (
    <button
      type='button'
      disabled={!isActive}
      className={cn(
        'inline-flex min-w-[130px] items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition',
        isActive
          ? 'border border-amber-300/35 bg-amber-400/20 text-amber-100 hover:bg-amber-400/30'
          : 'cursor-not-allowed border border-slate-600/50 bg-slate-700/35 text-slate-400'
      )}
    >
      Purchase
    </button>
  );
}

export function RewardDetailModal({
  reward,
  balance,
  isOpen,
  onClose
}: {
  reward: RewardItem | null;
  balance: GemBalance;
  isOpen: boolean;
  onClose: () => void;
}) {
  const buildInitialSelection = (rule: PricingRule): SelectionState => {
    const initial = getDefaultSelection(rule);

    return {
      managerial: Math.min(initial.managerial, balance.managerial),
      weCare: Math.min(initial.weCare, balance.weCare),
      betterTogether: Math.min(initial.betterTogether, balance.betterTogether),
      gameChanger: Math.min(initial.gameChanger, balance.gameChanger)
    };
  };

  const [selection, setSelection] = useState<SelectionState>(() =>
    buildInitialSelection(reward?.pricingRule ?? { type: 'any_only', anyAmount: 0 })
  );

  useEffect(() => {
    if (!reward) return;
    setSelection(buildInitialSelection(reward.pricingRule));
  }, [reward]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  const validation = useMemo(() => {
    if (!reward) {
      return {
        isComplete: false,
        canAfford: false,
        missingTotal: 0,
        missingByType: {},
        requiredAny: 0,
        selectedAny: 0
      };
    }

    return validateSelection(reward.pricingRule, balance, selection);
  }, [reward, balance, selection]);

  if (!isOpen || !reward) return null;

  const gemTypes: GemType[] = ['managerial', 'weCare', 'betterTogether', 'gameChanger'];
  const allowedTypes = getAllowedGemTypes(reward.pricingRule);

  const handleIncrement = (gemType: GemType) => {
    if (!canIncrement(gemType, reward.pricingRule, balance, selection)) return;
    setSelection((prev) => ({ ...prev, [gemType]: prev[gemType] + 1 }));
  };

  const handleDecrement = (gemType: GemType) => {
    if (!canDecrement(gemType, reward.pricingRule, selection)) return;
    setSelection((prev) => ({ ...prev, [gemType]: prev[gemType] - 1 }));
  };

  const helperText = getSelectionHelperText(reward.pricingRule, validation);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6' role='dialog' aria-modal='true' aria-label={`${reward.title} details`}>
      <button type='button' onClick={onClose} className='absolute inset-0 bg-[#020716]/72 backdrop-blur-[2px]' aria-label='Close modal overlay' />

      <article
        className={cn(
          'relative z-10 grid max-h-[96vh] w-full max-w-[1180px] overflow-hidden rounded-2xl border border-white/15',
          'bg-[linear-gradient(165deg,rgba(13,23,52,0.96)_0%,rgba(8,16,40,0.98)_100%)] shadow-[0_30px_80px_rgba(0,0,0,0.55)]',
          'md:grid-cols-[1fr_1fr]'
        )}
      >
        <div className='relative min-h-[260px] overflow-hidden border-b border-white/10 md:min-h-full md:border-b-0 md:border-r'>
          <img src={reward.image} alt={reward.title} className='h-full w-full object-cover' />
          <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050b1f]/60 via-transparent to-transparent' />
        </div>

        <div className='flex max-h-[96vh] flex-col overflow-hidden'>
          <div className='flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 lg:px-6'>
            <div>
              <h2 className='text-2xl font-semibold tracking-tight text-slate-100'>{reward.title}</h2>
              <p className='mt-1 text-sm text-slate-400'>{reward.shortDescription}</p>
            </div>

            <button
              type='button'
              onClick={onClose}
              className='grid size-8 place-items-center rounded-md border border-white/15 bg-white/5 text-slate-200 transition hover:bg-white/10'
              aria-label='Close product details'
            >
              &times;
            </button>
          </div>

          <div className='flex-1 space-y-4 overflow-y-auto px-5 py-4 lg:px-6'>
            <p className='text-sm leading-relaxed text-slate-300'>{reward.fullDescription}</p>


            <div className='relative -mt-[50px] space-y-4'>
              <div>
                <p className='mb-2 text-sm font-medium text-slate-200'>Gem Allocation</p>
                <div className='space-y-2'>
                  {gemTypes.map((gemType) => {
                    const disabled = !allowedTypes.has(gemType);
                    const canPlus = canIncrement(gemType, reward.pricingRule, balance, selection);
                    const canMinus = canDecrement(gemType, reward.pricingRule, selection);

                    return (
                      <GemSelectorRow
                        key={gemType}
                        gemType={gemType}
                        available={balance[gemType]}
                        selected={selection[gemType]}
                        disabled={disabled}
                        canPlus={canPlus}
                        canMinus={canMinus}
                        onPlus={() => handleIncrement(gemType)}
                        onMinus={() => handleDecrement(gemType)}
                      />
                    );
                  })}
                </div>
              </div>

              <PurchaseSummary pricingRule={reward.pricingRule} selection={selection} balance={balance} />
            </div>
          </div>

          <div className='flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4 lg:px-6'>
            <p className={cn('text-sm', validation.isComplete ? 'text-emerald-300' : 'text-amber-200')}>{helperText}</p>
            <CTAButton isActive={validation.isComplete && validation.canAfford} />
          </div>
        </div>
      </article>
    </div>
  );
}










