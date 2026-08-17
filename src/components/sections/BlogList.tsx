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

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Bank: BankOutlined,
  Buildings: ApartmentOutlined,
  UsersThree: TeamOutlined,
  ShieldCheck: SafetyOutlined,
};

export function BlogList() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {BLOG_POSTS.map((post, i) => {
        const IconCmp = ICONS[post.icon];
        return (
          <Reveal key={post.slug} delay={(i % 3) * 0.06}>
            <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
              <div className="flex aspect-[16/10] items-center justify-center rounded-2xl border border-line bg-paper-dim transition-colors duration-300 group-hover:border-accent/40">
                <IconCmp className="[&>svg]:size-10 text-accent transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="mt-5 text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
                {post.category}
              </span>
              <h3 className="mt-2 text-lg font-medium leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-accent">
                {post.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
              <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-paper transition-colors duration-300 group-hover:bg-accent">
                Read {post.readMinutes} min
                <ArrowRightOutlined className="[&>svg]:size-3" />
              </span>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
