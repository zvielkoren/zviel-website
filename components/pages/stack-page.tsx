import { stackGroups, stackIntro } from "@/data/stack";

export function StackPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
      <header className="mb-12 space-y-4">
        <div className="flex items-center gap-4">
          <span className="h-px w-12 bg-primary" />
          <p className="font-headline text-[10px] uppercase tracking-[0.2em] text-primary">Technical Capabilities</p>
        </div>
        <h1 className="font-headline text-5xl font-bold tracking-tight sm:text-7xl">
          Engineered for <span className="text-primary-strong">Resilience.</span>
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-text-muted">{stackIntro.subtitle}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {stackGroups.map((group) => (
          <article key={group.category} className="panel bg-surface-low">
            <h2 className="font-headline text-2xl font-bold uppercase tracking-[0.06em] text-text">{group.category}</h2>
            <p className="mt-2 text-sm leading-6 text-text-muted">{group.description}</p>
            <ul className="mt-5 space-y-3">
              {group.items.map((item) => (
                <li key={item.name} className="rounded-sm border border-border/30 bg-surface-mid p-3">
                  <p className="font-headline text-sm uppercase tracking-[0.08em] text-primary">{item.name}</p>
                  <p className="mt-1 text-sm text-text-muted">{item.detail}</p>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
