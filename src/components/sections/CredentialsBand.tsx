import {
  Certificate,
  ShieldCheck,
  Bank,
  Buildings,
  UsersThree,
  GearSix,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { CREDENTIALS } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const ICONS: Record<string, Icon> = {
  Certificate,
  ShieldCheck,
  Bank,
  Buildings,
  UsersThree,
  GearSix,
};

export function CredentialsBand() {
  return (
    <section className="border-b border-line bg-paper-dim/50 py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Trusted delivery"
          title="Credentials, regulation, and capacity you can check."
          body="Data is handled under a UK GDPR-aligned framework, with defined retention rules, role-based access, and a documented incident-response process."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CREDENTIALS.map((item, i) => {
            const IconCmp = ICONS[item.icon];
            return (
              <Reveal key={item.title} delay={(i % 3) * 0.06}>
                <SpotlightCard className="flex h-full flex-col gap-4 rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ink/30 hover:shadow-[0_20px_40px_-24px_rgba(20,20,20,0.25)]">
                  <IconCmp weight="light" className="size-7 text-accent" />
                  <div>
                    <h3 className="text-base font-medium tracking-tight text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.body}</p>
                  </div>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
