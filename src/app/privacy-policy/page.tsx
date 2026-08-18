import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { LegalDocument } from "@/components/layout/LegalDocument";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "information-we-collect",
      title: "Information we collect",
      body: (
        <p>
          Finbook Global collects only the information needed to respond to enquiries and deliver accounting services to clients, including names, contact details, and financial documents shared under an engagement agreement.
        </p>
      ),
    },
    {
      id: "how-we-handle-data",
      title: "How we handle client data",
      body: (
        <p>
          Client financial data is handled under strict access controls and is never sold or shared with third parties outside the scope of the engagement.
        </p>
      ),
    },
    {
      id: "privacy-questions",
      title: "Questions and data requests",
      body: (
        <p>
          For questions about this policy or a data request, contact{" "}
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
        title="Privacy policy"
        body="How Finbook Global collects, uses and protects information shared with us."
        className="pb-11 pt-10 md:pb-14 md:pt-14"
      />
      <LegalDocument sections={sections} alternateHref="/terms-condition" alternateLabel="terms and conditions" />
    </>
  );
}
