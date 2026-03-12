import Link from 'next/link';

const links = [
  { href: '/profile', label: 'Профіль' },
  { href: '/transfer', label: 'Передача гемів' },
  { href: '/shop', label: 'Магазин' }
];

export function Header({ active }: { active?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/profile" className="text-xl font-semibold tracking-wide text-white">
          GemPulse
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={`nav-link ${active === link.href ? 'active' : ''}`}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="nav-link border border-white/15">
          Вийти
        </Link>
      </div>
    </header>
  );
}
