import { architectureNodes, coreCompetency, liveLogs, metrics } from "@/data/overview";
import { siteIdentity } from "@/data/site";

export function OverviewPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-sm border border-border/40 bg-surface-highest/40 px-3 py-1 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="font-headline text-[10px] uppercase tracking-[0.2em] text-primary">{siteIdentity.status}</span>
          </div>
          <h1 className="font-headline text-5xl font-bold leading-[0.95] tracking-tight text-text sm:text-7xl">
            I build scalable systems that <span className="text-primary">don&apos;t break.</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-text-muted">{siteIdentity.heroSummary}</p>
          <div className="flex flex-wrap gap-3">
            <a href="/projects" className="tab-solid">
              View Projects
            </a>
            <a href="/contact" className="tab">
              Contact
            </a>
          </div>
        </div>

        <div className="grid gap-4 lg:col-span-5 lg:grid-cols-2">
          <article className="panel relative col-span-full min-h-44 overflow-hidden bg-surface-low/90 backdrop-blur-md">
            <p className="font-headline text-[10px] uppercase tracking-[0.15em] text-primary">Core Competency</p>
            <h2 className="mt-4 max-w-sm font-headline text-3xl font-bold">{coreCompetency.title}</h2>
            <div className="mt-8 flex items-center justify-between font-headline text-[10px] uppercase tracking-[0.08em]">
              <span className="text-text-dim">{coreCompetency.subLeft}</span>
              <span className="text-primary">{coreCompetency.subRight}</span>
            </div>
          </article>

          {metrics.map((item) => (
            <article key={item.label} className="panel bg-surface-low/90 backdrop-blur-md">
              <p className="font-headline text-[10px] uppercase tracking-[0.08em] text-text-dim">{item.label}</p>
              <p className={`mt-2 font-headline text-4xl font-bold tracking-tight ${item.label === "Latency" ? "text-primary-strong" : ""}`}>
                {item.value}
              </p>
              <p className="mt-2 font-headline text-[10px] uppercase tracking-[0.08em] text-text-dim">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>

      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between border-b border-border/30 pb-3">
          <h2 className="font-headline text-xl font-bold uppercase tracking-[0.1em]">Live System Logs</h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-dim">TIMESTAMP // EVENT_ID // STATUS</p>
        </div>
        <div className="space-y-px">
          {liveLogs.map((entry, index) => (
            <article
              key={`${entry.timestamp}-${entry.state}`}
              className={`flex flex-col items-start justify-between gap-4 px-4 py-3 sm:flex-row sm:items-center ${
                index % 2 === 0 ? "bg-surface-low" : "bg-surface"
              }`}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                <span className="font-mono text-[10px] text-primary-strong/90">{entry.timestamp}</span>
                <span className="text-sm text-text">{entry.event}</span>
              </div>
              <span className="chip border-primary-strong/25 bg-primary-strong/10 text-primary">{entry.state}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-5 md:grid-cols-3">
        {architectureNodes.map((node) => (
          <article
            key={node.id}
            className="panel flex aspect-video items-center justify-center bg-gradient-to-br from-surface-high to-surface-low"
          >
            <div className="text-center">
              <p className="font-headline text-[10px] uppercase tracking-[0.15em] text-primary">{node.id}</p>
              <p className="mt-2 font-headline text-xl font-bold">{node.label}</p>
            </div>
          </article>
        ))}
      </section>
    </section>
  );
}
