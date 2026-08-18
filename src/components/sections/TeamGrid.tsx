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
        "grid grid-cols-2 gap-2.5 md:gap-4",
        compact ? "sm:grid-cols-4" : "sm:grid-cols-3 lg:grid-cols-5",
      )}
    >
      {members.map((member, i) => (
        <Reveal key={member.name} delay={(i % 5) * 0.05}>
          <TiltCard strength={4}>
            <div
              tabIndex={0}
              aria-label={`${member.name}, ${member.credentials}, ${member.role}`}
              className="group relative flex h-36 items-center justify-center overflow-hidden rounded-md border border-line bg-transparent p-3 text-center outline-none transition-colors duration-300 hover:border-teal focus-visible:border-teal focus-visible:ring-2 focus-visible:ring-teal/30 md:h-44 md:p-4 lg:h-52"
            >
              <Image
                src={member.image}
                alt={member.name}
                width={160}
                height={160}
                className="size-20 rounded-full border-2 border-teal/35 object-cover grayscale transition-all duration-300 group-hover:-translate-y-5 group-hover:scale-90 group-hover:border-teal group-hover:grayscale-0 group-focus:-translate-y-5 group-focus:scale-90 group-focus:border-teal group-focus:grayscale-0 md:size-28"
              />
              <div className="absolute inset-x-2 bottom-2 translate-y-3 rounded-md bg-ink/95 px-2 py-2 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100 md:inset-x-3 md:bottom-3 md:px-3 md:py-2.5">
                <h3 className="text-xs text-paper md:text-sm">{member.name}</h3>
                <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.08em] text-teal md:text-[9px]">
                  {member.credentials}
                </p>
                <p className="mt-1 line-clamp-2 text-[9px] leading-snug text-paper/65 md:text-[10px]">{member.role}</p>
              </div>
            </div>
          </TiltCard>
        </Reveal>
      ))}
    </div>
  );
}
