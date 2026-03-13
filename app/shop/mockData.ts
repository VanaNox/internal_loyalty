import type { GemBalance, GemType, RewardItem } from './types';

export const GEM_META: Record<GemType, { label: string; gemVisual: 'gold' | 'ruby' | 'emerald' | 'sapphire'; ring: string }> = {
  managerial: { label: 'Managerial', gemVisual: 'gold', ring: 'ring-amber-300/35' },
  weCare: { label: 'We Care', gemVisual: 'ruby', ring: 'ring-pink-300/35' },
  betterTogether: { label: 'Better Together', gemVisual: 'emerald', ring: 'ring-emerald-300/35' },
  gameChanger: { label: 'Game Changer', gemVisual: 'sapphire', ring: 'ring-blue-300/35' }
};

export const USER_BALANCE: GemBalance = {
  managerial: 4,
  weCare: 6,
  betterTogether: 3,
  gameChanger: 2
};

export const REWARDS: RewardItem[] = [
  {
    id: 'reward-1',
    title: 'Noise-Cancelling Headphones',
    shortDescription: 'Premium audio for deep focus sessions',
    fullDescription:
      'Recharge your focus with adaptive noise cancellation, all-day comfort, and crystal-clear calls. Includes travel case and USB-C fast charging for hybrid workdays.',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    pricingRule: {
      type: 'specific_plus_any',
      specificGemType: 'managerial',
      specificAmount: 2,
      anyAmount: 3
    }
  },
  {
    id: 'reward-2',
    title: 'Wellness Day Voucher',
    shortDescription: 'A curated day to reset and recover',
    fullDescription:
      'Redeem a full wellness package with spa access, guided recovery session, and healthy lunch. Designed to support sustainable performance and wellbeing.',
    image:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
    pricingRule: {
      type: 'any_only',
      anyAmount: 5
    }
  },
  {
    id: 'reward-3',
    title: 'Team Retreat Pass',
    shortDescription: 'Collaborative offsite experience',
    fullDescription:
      'Join an offsite day focused on strategy, trust-building workshops, and high-impact collaboration practices with cross-functional peers.',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    pricingRule: {
      type: 'multi_specific',
      requirements: [
        { gemType: 'weCare', amount: 2 },
        { gemType: 'betterTogether', amount: 4 }
      ]
    }
  },
  {
    id: 'reward-4',
    title: 'Masterclass Subscription',
    shortDescription: 'One-year leadership and innovation learning',
    fullDescription:
      'Access a premium library of leadership, communication, and innovation courses with practical frameworks you can apply right away.',
    image:
      'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1200&q=80',
    pricingRule: {
      type: 'specific_plus_any',
      specificGemType: 'gameChanger',
      specificAmount: 1,
      anyAmount: 4
    }
  },
  {
    id: 'reward-5',
    title: 'Dinner for Two',
    shortDescription: 'Fine dining experience at partner venues',
    fullDescription:
      'Celebrate milestones with a premium dining voucher valid across selected partner restaurants and seasonal tasting menus.',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
    pricingRule: {
      type: 'any_only',
      anyAmount: 7
    }
  },
  {
    id: 'reward-6',
    title: 'Impact Award Kit',
    shortDescription: 'Recognition package for standout execution',
    fullDescription:
      'A recognition bundle including engraved trophy, executive shoutout card, and premium notebook set for exceptional contribution.',
    image:
      'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80',
    pricingRule: {
      type: 'multi_specific',
      requirements: [
        { gemType: 'managerial', amount: 2 },
        { gemType: 'gameChanger', amount: 2 }
      ]
    }
  }
];
