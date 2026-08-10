import Image from "next/image";
import { TEAM } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";

export function TeamDetailed() {
  return (
    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {TEAM.map((member, i) => (
        <Reveal key={member.name} delay={(i % 3) * 0.06}>
          <div className="group overflow-hidden rounded-2xl bg-paper-dim">
            <Image
              src={member.image}
              alt={member.name}
              width={294}
              height={314}
              className="aspect-[3/4] w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
            />
          </div>
          <h3 className="mt-4 text-lg font-medium tracking-tight text-ink">{member.name}</h3>
          <p className="text-sm text-accent">{member.role}</p>
          <p className="mt-0.5 text-xs uppercase tracking-wide text-muted">
            {member.credentials}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{member.bio}</p>
        </Reveal>
      ))}
    </div>
  );
}
