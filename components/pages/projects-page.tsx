import { featuredProjects } from "@/data/projects";

export function ProjectsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
      <header className="mb-12 space-y-4">
        <div className="flex items-center gap-4">
          <span className="h-px w-12 bg-primary" />
          <p className="font-headline text-[10px] uppercase tracking-[0.2em] text-primary">Core Production Environment</p>
        </div>
        <h1 className="font-headline text-5xl font-bold tracking-tight sm:text-7xl">
          Flagship <span className="text-primary-strong">Infrastructure.</span>
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-text-muted">
          High-availability backend systems and scalable architecture designed for maximum fault tolerance and technical
          precision. No fluff, just engineering.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {featuredProjects.map((project) => (
          <article key={project.code} className="panel relative flex min-h-80 flex-col bg-surface-high">
            <span className="absolute right-4 top-4 font-headline text-[10px] text-text-dim/70">{project.code}</span>
            <h2 className="mt-8 font-headline text-3xl font-bold leading-tight">{project.title}</h2>
            <p className="mt-4 text-sm leading-7 text-text-muted">{project.summary}</p>
            <div className="mt-auto flex flex-wrap gap-2 pt-8">
              {project.stack.map((tech) => (
                <span key={tech} className="chip">
                  {tech}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <section className="mt-12 panel flex flex-col items-start justify-between gap-6 bg-surface-low sm:flex-row sm:items-center">
        <div>
          <h3 className="font-headline text-2xl font-bold">Ready to scale?</h3>
          <p className="mt-1 text-sm text-text-muted">Available for backend consulting and architecture audits.</p>
        </div>
        <a href="/contact" className="tab-solid">
          Initialize Contact
        </a>
      </section>
    </section>
  );
}
