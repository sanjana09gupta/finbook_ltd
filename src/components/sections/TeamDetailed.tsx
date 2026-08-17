import Image from "next/image";
import { TEAM } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";

export function TeamDetailed() {
  return (
    <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {TEAM.map((member, i) => (
        <Reveal key={member.name} delay={(i % 3) * 0.06}>
          <div className="group flex h-full flex-col rounded-2xl border border-line bg-paper-dim/60 p-6">
            <Image
              src={member.image}
              alt={member.name}
              width={160}
              height={160}
              className="size-16 rounded-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 md:size-20"
            />
            <h3 className="mt-4 text-lg font-medium tracking-tight text-ink">{member.name}</h3>
            <p className="text-sm text-accent">{member.role}</p>
            <p className="mt-0.5 text-xs uppercase tracking-wide text-muted">
              {member.credentials}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{member.bio}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
