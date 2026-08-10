import Image from "next/image";
import { TEAM } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
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
        <Reveal key={member.name} delay={(i % 5) * 0.05}>
          <div className="group relative overflow-hidden rounded-2xl bg-paper-dim">
            <Image
              src={member.image}
              alt={member.name}
              width={294}
              height={314}
              className="aspect-[3/4] w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/85 via-ink/0 to-transparent p-4 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
              <span className="translate-y-2 text-xs font-medium uppercase tracking-[0.14em] text-paper transition-transform duration-400 group-hover:translate-y-0">
                {member.credentials}
              </span>
            </div>
          </div>
          <h3 className="mt-3 text-sm font-medium text-ink">{member.name}</h3>
          <p className="text-xs text-muted">{member.role}</p>
        </Reveal>
      ))}
    </div>
  );
}
