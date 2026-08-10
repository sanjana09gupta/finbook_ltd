import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy policy" />
      <section className="pb-24">
        <div className="container-page max-w-2xl text-sm leading-relaxed text-muted">
          <p>
            Finbook Global collects only the information needed to respond to enquiries and
            deliver accounting services to clients, including names, contact details, and
            financial documents shared under an engagement agreement.
          </p>
          <p className="mt-4">
            Client financial data is handled under strict access controls and is never sold or
            shared with third parties outside the scope of the engagement. For questions about
            this policy or a data request, contact{" "}
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
