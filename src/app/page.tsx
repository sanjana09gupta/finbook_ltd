import { Hero } from "@/components/sections/home/Hero";
import { Stats } from "@/components/sections/Stats";
import { Process } from "@/components/sections/home/Process";
import { WhyFinbookGrid } from "@/components/sections/WhyFinbookGrid";
import { ServicesList } from "@/components/sections/home/ServicesList";
import { TeamTeaser } from "@/components/sections/home/TeamTeaser";
import { CtaBand } from "@/components/sections/CtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Process />
      <WhyFinbookGrid />
      <ServicesList />
      <TeamTeaser />
      <CtaBand />
    </>
  );
}
