import { contactChannels, contactDetails } from "@/data/contact";

export function ContactPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
      <header className="mb-12 space-y-4">
        <div className="flex items-center gap-3">
          <span className="h-px w-12 bg-primary" />
          <p className="font-headline text-[10px] uppercase tracking-[0.2em] text-primary">{contactDetails.kicker}</p>
        </div>
        <h1 className="font-headline text-5xl font-bold tracking-tight sm:text-7xl">
          Let&apos;s build the <span className="text-primary-strong">backbone</span> of your next project.
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-text-muted">{contactDetails.summary}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-12">
        <article className="panel md:col-span-8">
          <p className="chip inline-flex">Direct Link</p>
          <h2 className="mt-8 font-headline text-3xl font-bold sm:text-5xl">{contactDetails.email}</h2>
          <p className="mt-2 text-text-muted">{contactDetails.responseTime}</p>
        </article>

        {contactChannels.slice(0, 1).map((channel) => (
          <article key={channel.title} className="panel md:col-span-4">
            <p className="font-headline text-[10px] uppercase tracking-[0.08em] text-text-dim">{channel.label}</p>
            <h3 className="mt-4 font-headline text-3xl font-bold">{channel.title}</h3>
            <p className="mt-2 text-sm text-text-muted">{channel.detail}</p>
          </article>
        ))}

        {contactChannels.slice(1).map((channel) => (
          <article key={channel.title} className="panel md:col-span-4">
            <p className="font-headline text-[10px] uppercase tracking-[0.08em] text-text-dim">{channel.label}</p>
            <h3 className="mt-4 font-headline text-3xl font-bold">{channel.title}</h3>
            <p className="mt-2 text-sm text-text-muted">{channel.detail}</p>
          </article>
        ))}

        <article className="rounded-sm border border-primary-strong/40 bg-primary-strong/10 p-1 md:col-span-8">
          <div className="panel flex h-full flex-col gap-5 bg-surface sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-headline text-2xl font-bold text-primary">{contactDetails.ctaTitle}</h3>
              <p className="mt-1 text-sm text-text-muted">{contactDetails.ctaText}</p>
            </div>
            <a className="tab-solid justify-center px-8 py-4 text-sm" href={`mailto:${contactDetails.email}`}>
              Book Introduction
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
