import Image from "next/image";
import { TEAM } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { cn } from "@/lib/cn";

export function TeamGrid({ compact = false }: { compact?: boolean }) {
  const members = compact ? TEAM.slice(0, 4) : TEAM;

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4",
        compact ? "sm:grid-cols-4" : "sm:grid-cols-3 lg:grid-cols-5",
      )}
    >
      {members.map((member, i) => (
        <Reveal key={member.name} delay={(i % 5) * 0.05}>
          <TiltCard strength={4}>
            <div className="group flex h-full flex-col rounded-2xl border border-line bg-paper-dim/60 p-5 transition-colors duration-300 hover:border-accent/40">
              <Image
                src={member.image}
                alt={member.name}
                width={112}
                height={112}
                className="size-14 rounded-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 md:size-16"
              />
              <h3 className="mt-4 text-sm font-medium text-ink">{member.name}</h3>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-accent">
                {member.credentials}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted">{member.role}</p>
            </div>
          </TiltCard>
        </Reveal>
      ))}
    </div>
  );
}
