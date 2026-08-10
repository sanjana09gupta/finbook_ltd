import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms & conditions" />
      <section className="pb-24">
        <div className="container-page max-w-2xl text-sm leading-relaxed text-muted">
          <p>
            Finbook Global provides outsourced bookkeeping, taxation, and CFO advisory services.
            We do not provide services that would require a license to practice public
            accountancy.
          </p>
          <p className="mt-4">
            Engagements are governed by a signed service agreement outlining scope, fees, and
            responsibilities between Finbook Global and the client. For a copy of our current
            terms, contact{" "}
            <a href={`mailto:${SITE.email}`} className="text-ink underline underline-offset-2">
              {SITE.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
