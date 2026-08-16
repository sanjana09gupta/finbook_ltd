import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { OfficesList } from "@/components/sections/OfficesList";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Finbook Global's accounting team in India, the United Kingdom, and the United States.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Wherever you are, we're a call away."
        body="Send a short note about your business and one of our accountants will get back to you within a business day."
      />

      <section className="py-20 md:py-28">
        <div className="container-page grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.08}>
            <OfficesList />
          </Reveal>
        </div>
      </section>
    </>
  );
}
