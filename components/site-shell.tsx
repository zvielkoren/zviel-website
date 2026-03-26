import Link from "next/link";
import type { ReactNode } from "react";

import { navItems, type RouteKey } from "@/data/navigation";
import { footerText, siteIdentity, socialLinks } from "@/data/site";

type SiteShellProps = {
  active: RouteKey;
  children: ReactNode;
};

function tabClass(active: boolean): string {
  return active
    ? "border-b-2 border-primary-strong pb-1 text-primary-strong"
    : "text-text-dim hover:text-primary";
}

export function SiteShell({ active, children }: SiteShellProps) {
  return (
    <div className="min-h-screen bg-background text-text">
      <header className="sticky top-0 z-50 border-b border-primary-strong/20 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
          <Link className="font-headline text-lg font-bold tracking-tight text-primary uppercase" href="/">
            {siteIdentity.name}
          </Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`font-headline text-xs uppercase tracking-[0.08em] transition-colors ${tabClass(
                  item.key === active
                )}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/contact"
            className="tab tab-solid hidden md:inline-flex"
            aria-label="Hire Me and open contact page"
          >
            Hire Me
          </Link>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden min-h-[calc(100vh-4rem)] w-64 flex-col border-r border-primary-strong/10 bg-surface-low lg:flex">
          <div className="border-b border-primary-strong/10 px-6 py-6">
            <p className="font-headline text-lg font-bold tracking-tight text-primary-strong uppercase">
              {siteIdentity.brandLabel}
            </p>
            <p className="font-headline text-[10px] uppercase tracking-[0.2em] text-text-dim">
              {siteIdentity.role}
            </p>
          </div>
          <nav className="flex-1 px-3 py-4" aria-label="Section">
            {navItems.map((item) => {
              const isActive = item.key === active;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`mb-1 flex items-center px-4 py-3 font-headline text-sm tracking-wider transition-colors ${
                    isActive
                      ? "border-l-4 border-primary-strong bg-surface-highest text-primary-strong"
                      : "text-text-dim hover:bg-surface-highest hover:text-text"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-primary-strong/10 p-6">
            <button className="tab w-full justify-center text-[11px] uppercase tracking-[0.2em]">Download CV</button>
          </div>
        </aside>

        <main className="w-full bg-blueprint bg-[length:40px_40px]">{children}</main>
      </div>

      <footer className="border-t border-primary-strong/10 bg-background">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-8 text-[10px] uppercase tracking-[0.1em] text-text-dim sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>{footerText}</p>
          <div className="flex flex-wrap gap-6">
            {socialLinks.map((item) => (
              <a key={item.label} href={item.href} className="text-text-dim transition-colors hover:text-primary">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
