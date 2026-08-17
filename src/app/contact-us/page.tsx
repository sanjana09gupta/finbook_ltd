import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { OfficesList } from "@/components/sections/OfficesList";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

const SYNC_TOOLS = [
  { name: "Google Calendar", slug: "googlecalendar" },
  { name: "Google Meet", slug: "googlemeet" },
  { name: "Gmail", slug: "gmail" },
];

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

        <Reveal delay={0.12} className="container-page mt-16 border-t border-line pt-12">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-center sm:gap-8 sm:text-left">
            <div className="flex items-center gap-4">
              {SYNC_TOOLS.map((tool, i) => (
                <div
                  key={tool.slug}
                  className={cn(
                    "flex size-12 items-center justify-center rounded-2xl border border-line bg-paper shadow-[0_8px_20px_-12px_rgba(20,20,20,0.25)] transition-all duration-300 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_14px_28px_-14px_rgba(20,20,20,0.3)]",
                    i % 2 === 0 ? "-rotate-3" : "translate-y-3 rotate-3",
                  )}
                >
                  <Image
                    src={`https://cdn.simpleicons.org/${tool.slug}`}
                    alt={tool.name}
                    width={22}
                    height={22}
                    unoptimized
                    className="size-[22px]"
                  />
                </div>
              ))}
            </div>
            <p className="max-w-sm text-sm text-muted">
              Booking a slot adds it straight to Google Calendar with a Google Meet link,
              confirmed by email.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
