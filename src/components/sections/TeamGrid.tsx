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
            <div
              tabIndex={0}
              aria-label={`${member.name}, ${member.credentials}, ${member.role}`}
              className="group flex min-h-64 h-full flex-col items-center justify-center rounded-md border border-line bg-paper p-5 text-center outline-none transition-all duration-300 hover:border-teal focus-visible:border-teal focus-visible:ring-2 focus-visible:ring-teal/30"
            >
              <Image
                src={member.image}
                alt={member.name}
                width={160}
                height={160}
                className="size-24 rounded-full border-2 border-teal/35 object-cover grayscale transition-all duration-500 group-hover:-translate-y-2 group-hover:border-teal group-hover:grayscale-0 group-focus:-translate-y-2 group-focus:border-teal group-focus:grayscale-0 md:size-28"
              />
              <div className="mt-5 translate-y-0 opacity-100 transition-all duration-300 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus:translate-y-0 md:group-focus:opacity-100">
                <h3 className="text-base text-ink">{member.name}</h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-teal">
                  {member.credentials}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted">{member.role}</p>
              </div>
            </div>
          </TiltCard>
        </Reveal>
      ))}
    </div>
  );
}
