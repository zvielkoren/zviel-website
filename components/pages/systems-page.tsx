import { activityLogs, experimentFilters, labHighlights } from "@/data/experiments";

export function SystemsPage() {
  const [primary, secondary, tertiary, quaternary] = labHighlights;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
      <header className="mb-10 space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <p className="font-headline text-[10px] uppercase tracking-[0.2em] text-text-muted">Live Environments // R&D Labs</p>
        </div>
        <h1 className="font-headline text-5xl font-bold tracking-tight sm:text-7xl">
          Systems & <span className="text-primary-strong">Experiments</span>
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-text-muted">
          Internal tools, infrastructure blueprints, and early-stage explorations in distributed computing, LLM
          orchestration, and low-latency systems.
        </p>
      </header>

      <div className="mb-8 flex flex-wrap gap-2">
        {experimentFilters.map((filter, index) => (
          <button key={filter} className={index === 0 ? "tab-solid" : "tab"} type="button">
            {filter}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <article className="panel md:col-span-8">
          <p className="font-headline text-[10px] uppercase tracking-[0.1em] text-primary/40">{primary.category}</p>
          <h2 className="mt-3 font-headline text-4xl font-bold">{primary.name}</h2>
          <p className="mt-3 max-w-xl text-text-muted">{primary.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {primary.tags.map((tag) => (
              <span key={tag} className="chip border-primary-strong/30 text-primary">
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-8 font-headline text-sm uppercase tracking-[0.08em] text-text-dim">
            Uptime Index <span className="ml-2 text-2xl tracking-tight text-primary">{primary.stats?.[0]?.value}</span>
          </p>
        </article>

        <article className="panel md:col-span-4">
          <p className="font-headline text-[10px] uppercase tracking-[0.08em] text-primary">{secondary.category}</p>
          <h3 className="mt-2 font-headline text-3xl font-bold">{secondary.name}</h3>
          <p className="mt-3 text-sm text-text-muted">{secondary.summary}</p>
          <div className="mt-10">
            <p className="font-headline text-[10px] uppercase tracking-[0.08em] text-text-dim">IO Throughput</p>
            <div className="mt-3 h-1 w-full rounded-full bg-surface-low">
              <div className="h-1 w-4/5 rounded-full bg-primary" />
            </div>
          </div>
        </article>

        <article className="panel md:col-span-4">
          <h3 className="font-headline text-2xl font-bold">{tertiary.name}</h3>
          <div className="mt-4 space-y-3">
            {tertiary.tags.map((line) => (
              <p key={line} className="border-b border-border/20 pb-2 font-mono text-xs text-text-muted last:border-0">
                {line}
              </p>
            ))}
          </div>
          <p className="mt-6 text-xs text-text-muted">{tertiary.summary}</p>
        </article>

        <article className="panel md:col-span-8">
          <p className="font-headline text-[10px] uppercase tracking-[0.2em] text-primary">{quaternary.category}</p>
          <h3 className="mt-2 font-headline text-4xl font-bold">{quaternary.name}</h3>
          <p className="mt-2 max-w-xl text-sm text-text-muted">{quaternary.summary}</p>
        </article>
      </div>

      <section className="mt-14">
        <div className="mb-5 flex items-center justify-between border-b border-border/30 pb-3">
          <h2 className="font-headline text-2xl font-bold uppercase tracking-[0.08em]">System Logs // Activity</h2>
          <span className="font-mono text-primary">sync</span>
        </div>

        <div className="overflow-hidden rounded-sm border border-border/30">
          {activityLogs.map((item, index) => (
            <article
              key={`${item.time}-${item.source}`}
              className={`grid gap-3 px-4 py-3 text-xs md:grid-cols-[1.2fr_1.3fr_4fr_1.3fr] ${
                index % 2 === 0 ? "bg-surface" : "bg-surface-low"
              }`}
            >
              <span className="font-mono text-primary/80">{item.time}</span>
              <span className={`font-headline uppercase tracking-[0.08em] ${item.level === "error" ? "text-danger" : "text-primary"}`}>
                {item.source}
              </span>
              <span className="text-text">{item.message}</span>
              <span className="text-right font-mono text-text-dim">{item.region}</span>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
