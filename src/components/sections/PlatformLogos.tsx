import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

const ICON_PLATFORMS = [
  { name: "QuickBooks", slug: "quickbooks" },
  { name: "Xero", slug: "xero" },
  { name: "Sage", slug: "sage" },
  { name: "Zoho Books", slug: "zoho" },
];

const TEXT_PLATFORMS = ["Tally on Cloud", "NetSuite"];

export function PlatformLogos() {
  return (
    <section className="border-b border-line py-16 md:py-20">
      <div className="container-page">
        <SectionHeading title="We work inside the software you already use." align="center" />

        <Reveal delay={0.1} className="mt-12 flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
          {ICON_PLATFORMS.map((platform) => (
            <Image
              key={platform.slug}
              src={`https://cdn.simpleicons.org/${platform.slug}/141414`}
              alt={platform.name}
              width={112}
              height={32}
              unoptimized
              className="h-7 w-auto opacity-70 grayscale transition-opacity hover:opacity-100 md:h-8"
            />
          ))}
          {TEXT_PLATFORMS.map((name) => (
            <span
              key={name}
              className="rounded-full border border-line px-4 py-1.5 font-mono text-xs uppercase tracking-[0.1em] text-ink/50 transition-colors hover:border-ink/30 hover:text-ink"
            >
              {name}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
