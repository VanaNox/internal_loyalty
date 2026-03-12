export const profileUser = {
  name: 'Олексій Коваль',
  email: 'oleksii.koval@sfp.local',
  title: 'Senior Product Analyst'
};

export const myGems = [
  { name: 'Yellow', value: 12, color: 'from-amber-300/35 to-amber-500/15', dot: 'bg-amber-300' },
  { name: 'We Care', value: 7, color: 'from-pink-300/35 to-pink-500/15', dot: 'bg-pink-300' },
  { name: 'Better Together', value: 9, color: 'from-emerald-300/35 to-emerald-500/15', dot: 'bg-emerald-300' },
  { name: 'Gamechanger', value: 5, color: 'from-blue-300/35 to-blue-500/15', dot: 'bg-blue-300' }
];

export const transferGems = [
  { name: 'Managerial', value: 4, color: 'from-orange-300/35 to-orange-500/15', dot: 'bg-orange-300' },
  { name: 'Transparent', value: 8, color: 'from-slate-200/35 to-slate-400/15', dot: 'bg-slate-200' }
];

export const transactions = [
  {
    id: 'tx-1',
    date: '12.03.2026',
    from: 'Ірина Романюк',
    to: 'Олексій Коваль',
    gem: 'We Care',
    quantity: 2,
    direction: 'received' as const,
    comment: 'За підтримку релізу клієнтського дашборду.'
  },
  {
    id: 'tx-2',
    date: '10.03.2026',
    from: 'Олексій Коваль',
    to: 'Андрій Мельник',
    gem: 'Managerial',
    quantity: 1,
    direction: 'given' as const,
    comment: 'За менторство в onboarding процесі.'
  },
  {
    id: 'tx-3',
    date: '08.03.2026',
    from: 'Марина Ковальчук',
    to: 'Олексій Коваль',
    gem: 'Gamechanger',
    quantity: 3,
    direction: 'received' as const,
    comment: 'За ідею з оптимізацією pipeline.'
  },
  {
    id: 'tx-4',
    date: '05.03.2026',
    from: 'Олексій Коваль',
    to: 'Євген Кравець',
    gem: 'Transparent',
    quantity: 2,
    direction: 'given' as const,
    comment: 'За прозору комунікацію ризиків.'
  }
];

export const gems = myGems;

export const colleagues = [
  'Андрій Мельник',
  'Вікторія Гнатюк',
  'Євген Кравець',
  'Ірина Романюк',
  'Марина Ковальчук'
];

export const products = [
  { name: 'Wireless Headphones', price: 150, category: 'Tech' },
  { name: 'Coffee Gift Card', price: 60, category: 'Lifestyle' },
  { name: 'Notion Pro Subscription', price: 90, category: 'Software' }
];
