"use client";

import Link from "next/link";
import {
  BankOutlined,
  ApartmentOutlined,
  TeamOutlined,
  SafetyOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { BLOG_POSTS } from "@/lib/content";
import { cn } from "@/lib/cn";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Bank: BankOutlined,
  Buildings: ApartmentOutlined,
  UsersThree: TeamOutlined,
  ShieldCheck: SafetyOutlined,
};

// A distinct muted tint per category, so the grid reads as a set of
// individual pieces rather than one uniform grey icon tile repeated.
const TILE_STYLES: Record<string, string> = {
  Bank: "bg-[#f3e9dc] text-[#8a5a2b]",
  Buildings: "bg-[#e4ece8] text-[#3f6659]",
  UsersThree: "bg-[#f4e6ec] text-[#8a3a52]",
  ShieldCheck: "bg-[#e6eaf5] text-[#3d4f7a]",
};

function Thumbnail({ icon, size, className }: { icon: string; size: "lg" | "sm"; className?: string }) {
  const Icon = ICONS[icon];
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-3xl transition-transform duration-500 group-hover:scale-[1.02]",
        TILE_STYLES[icon],
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{ backgroundImage: "radial-gradient(circle at 22% 20%, currentColor, transparent 42%)" }}
      />
      <Icon
        className={cn(
          "relative transition-transform duration-500 group-hover:scale-110",
          size === "lg" ? "[&>svg]:size-16 md:[&>svg]:size-20" : "[&>svg]:size-10",
        )}
      />
    </div>
  );
}

export function BlogList() {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <div className="flex flex-col gap-14">
      {featured && (
        <Reveal>
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid items-center gap-8 md:grid-cols-2 md:gap-12"
          >
            <Thumbnail icon={featured.icon} size="lg" className="aspect-[4/3]" />
            <div>
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
                {featured.category}
              </span>
              <h2 className="mt-3 text-balance text-3xl font-medium leading-tight tracking-tight text-ink transition-colors duration-300 group-hover:text-accent md:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
                {featured.excerpt}
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                Read {featured.readMinutes} min
                <ArrowRightOutlined className="[&>svg]:size-3 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </Reveal>
      )}

      <div className="grid gap-8 border-t border-line pt-14 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post, i) => (
          <Reveal key={post.slug} delay={(i % 3) * 0.06}>
            <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
              <Thumbnail icon={post.icon} size="sm" className="aspect-[16/10]" />
              <span className="mt-5 text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
                {post.category}
              </span>
              <h3 className="mt-2 text-lg font-medium leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-accent">
                {post.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
              <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-ink">
                Read {post.readMinutes} min
                <ArrowRightOutlined className="[&>svg]:size-3 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
