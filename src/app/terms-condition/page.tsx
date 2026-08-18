import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { LegalDocument } from "@/components/layout/LegalDocument";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  const sections = [
    {
      id: "services",
      title: "Services",
      body: (
        <p>
          Finbook Global provides outsourced bookkeeping, taxation, and CFO advisory services. We do not provide services that would require a license to practice public accountancy.
        </p>
      ),
    },
    {
      id: "engagements",
      title: "Engagement terms",
      body: (
        <p>
          Engagements are governed by a signed service agreement outlining scope, fees, and responsibilities between Finbook Global and the client.
        </p>
      ),
    },
    {
      id: "current-terms",
      title: "Request the current terms",
      body: (
        <p>
          For a copy of our current terms, contact{" "}
          <a href={`mailto:${SITE.email}`} className="font-medium text-ink underline decoration-teal underline-offset-4">
            {SITE.email}
          </a>
          .
        </p>
      ),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & conditions"
        body="The service framework that applies when you work with Finbook Global."
        className="pb-11 pt-10 md:pb-14 md:pt-14"
      />
      <LegalDocument sections={sections} alternateHref="/privacy-policy" alternateLabel="privacy policy" />
    </>
  );
}
