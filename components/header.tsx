const links = [
  { href: '/profile', label: 'Profile' },
  { href: '/transfer', label: 'Send a Gem' },
  { href: '/shop', label: 'Store' }
];

export function Header({ active }: { active?: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070d21]/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1650px] items-center justify-between px-7 py-3 lg:px-12">
        <a href="/profile" className="text-3xl font-semibold tracking-tight text-slate-100">
          GemPulse
        </a>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Main navigation">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={
                active === link.href
                  ? 'rounded-xl bg-sky-500/16 px-4 py-2 text-sm font-medium text-sky-100 ring-1 ring-sky-300/35'
                  : 'rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/8 hover:text-slate-100'
              }
            >
              {link.label}
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