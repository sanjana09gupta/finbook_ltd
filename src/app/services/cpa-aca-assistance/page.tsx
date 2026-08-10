import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SplitImage } from "@/components/sections/SplitImage";
import { FeatureChecklist } from "@/components/sections/FeatureChecklist";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "CPA / ACA Assistance",
  description:
    "Structured mentorship and practical case exposure for accountants preparing for CPA or ACA examinations.",
};

const EXAM_ITEMS = [
  {
    title: "Structured study mentorship",
    body: "A working accountant, not a course video, checking your progress against the exam syllabus.",
  },
  {
    title: "Real client case exposure",
    body: "Practice on live engagement work, not recycled textbook scenarios.",
  },
  {
    title: "Mock exams and review",
    body: "Timed practice papers with detailed feedback on where marks were actually lost.",
  },
  {
    title: "Flexible scheduling",
    body: "Sessions built around your existing work hours, not the other way around.",
  },
];

export default function CpaAcaAssistancePage() {
  return (
    <>
      <PageHero
        eyebrow="CPA / ACA Assistance"
        title="Exam-ready, with mentors who do this for a living."
        body="Structured mentorship and practical case exposure for accountants working toward CPA or ACA certification, built around real client work."
      />

      <SplitImage
        title="Study with people already in the field"
        body="Every mentor on this program is a working chartered accountant at Finbook. You get exam preparation grounded in the same client work we run every day, not a generic prep course."
        image="/images/headerbannerpic.png"
        imageAlt="Finbook Global exam mentorship session"
      />

      <FeatureChecklist title="What's included" items={EXAM_ITEMS} />

      <CtaBand
        title="Preparing for your CPA or ACA exams?"
        body="Tell us where you are in the process and we'll map out a study plan on the call."
      />
    </>
  );
}
