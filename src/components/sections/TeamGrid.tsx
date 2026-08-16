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
        "grid grid-cols-2 gap-5",
        compact ? "sm:grid-cols-4" : "sm:grid-cols-3 lg:grid-cols-5",
      )}
    >
      {members.map((member, i) => (
        <Reveal
          key={member.name}
          delay={(i % 5) * 0.05}
          className={cn(i % 2 === 1 && "sm:mt-9")}
        >
          <TiltCard strength={6}>
            <div className="group relative overflow-hidden rounded-2xl border border-transparent bg-paper-dim transition-colors duration-300 hover:border-accent/50">
              <Image
                src={member.image}
                alt={member.name}
                width={294}
                height={314}
                className="aspect-[3/4] w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
              <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink shadow-sm backdrop-blur-sm">
                {member.credentials}
              </span>
            </div>
          </TiltCard>
          <h3 className="mt-3 text-sm font-medium text-ink">{member.name}</h3>
          <p className="text-xs text-muted">{member.role}</p>
        </Reveal>
      ))}
    </div>
  );
}
