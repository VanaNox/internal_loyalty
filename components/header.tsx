import Link from 'next/link';

const links = [
  { href: '/profile', label: 'Profile' },
  { href: '/transfer', label: 'Send a Gem' },
  { href: '/shop', label: 'Store' }
];

export function Header({ active }: { active?: string }) {
  return (
    <header className="profile-topbar sticky top-0 z-40">
      <div className="profile-topbar-inner mx-auto flex w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/profile" className="profile-brand">
          GemPulse
        </Link>

        <nav className="profile-top-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={`profile-top-link ${active === link.href ? 'active' : ''}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="profile-top-exit">
          Exit
        </Link>
      </div>
    </header>
  );
}