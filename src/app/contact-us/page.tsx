import type { Metadata } from "next";
import { MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { OFFICES } from "@/lib/content";

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
            <div className="flex flex-col gap-8">
              {OFFICES.map((office) => (
                <div key={office.country} className="border-t border-line pt-6 first:border-t-0 first:pt-0">
                  <h3 className="text-lg font-medium tracking-tight text-ink">{office.country}</h3>
                  <p className="mt-3 flex items-start gap-2.5 text-sm leading-relaxed text-muted">
                    <MapPin weight="light" className="mt-0.5 size-4 shrink-0 text-accent" />
                    {office.address}
                  </p>
                  <a
                    href={`tel:${office.phoneHref}`}
                    className="mt-2 flex items-center gap-2.5 text-sm text-ink/80 hover:text-ink"
                  >
                    <Phone weight="light" className="size-4 shrink-0 text-accent" />
                    {office.phone}
                  </a>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
