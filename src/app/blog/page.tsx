import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { BlogList } from "@/components/sections/BlogList";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical guides on UK VAT, Companies House compliance, payroll, and data protection from Finbook's accounting team.",
};

export default function BlogIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Notes on running the books properly."
        body="Practical guides on UK tax, compliance, and payroll, written by the team that files them."
      />

      <section className="py-20 md:py-28">
        <div className="container-page">
          <BlogList />
        </div>
      </section>
    </>
  );
}
