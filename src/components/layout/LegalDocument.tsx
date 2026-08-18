import Link from "next/link";
import type { ReactNode } from "react";

type LegalSection = {
  id: string;
  title: string;
  body: ReactNode;
};

type LegalDocumentProps = {
  sections: LegalSection[];
  alternateHref: string;
  alternateLabel: string;
};

export function LegalDocument({ sections, alternateHref, alternateLabel }: LegalDocumentProps) {
  return (
    <section className="border-b border-line bg-paper-dim py-10 md:py-16">
      <div className="container-page grid items-start gap-7 lg:grid-cols-[220px_minmax(0,760px)] lg:justify-center lg:gap-12">
        <aside className="rounded-md border border-line bg-paper p-4 md:p-5 lg:sticky lg:top-36">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-teal">
            In this document
          </p>
          <nav aria-label="Document sections" className="mt-4">
            <ul className="space-y-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-paper-dim hover:text-ink"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-5 border-t border-line pt-4">
            <Link href={alternateHref} className="text-xs font-medium text-teal underline-offset-4 hover:underline">
              View {alternateLabel}
            </Link>
          </div>
        </aside>

        <article className="overflow-hidden rounded-md border border-line bg-paper">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-36 border-b border-line p-5 last:border-b-0 md:p-8"
            >
              <div>
                <h2 className="text-xl tracking-tight text-ink md:text-2xl">{section.title}</h2>
                <div className="mt-3 text-sm leading-7 text-muted md:text-base md:leading-8">
                  {section.body}
                </div>
              </div>
            </section>
          ))}
        </article>
      </div>
    </section>
  );
}
