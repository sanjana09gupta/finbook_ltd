"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { List, X, CaretDown } from "@phosphor-icons/react/dist/ssr";
import { NAV_LINKS, CONTACT_CTA } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function Header() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("/").slice(0, 2).join("/"));
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between md:h-[72px]">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <motion.div whileHover={{ rotate: -4, scale: 1.03 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
            <Image
              src="/images/logo.svg"
              alt="Finbook Global"
              width={128}
              height={49}
              className="h-9 w-auto md:h-10"
              priority
            />
          </motion.div>
        </Link>

        <nav
          className="hidden items-center gap-8 lg:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {NAV_LINKS.map((link) => {
            const active = (hovered ?? "") === link.href || (!hovered && isActive(link.href));
            return (
              <div
                key={link.href}
                className="group relative"
                onMouseEnter={() => setHovered(link.href)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-1 py-1.5 text-sm font-medium text-ink/70 transition-colors hover:text-ink",
                    active && "text-ink",
                  )}
                >
                  {link.label}
                  {"children" in link && link.children && (
                    <CaretDown weight="bold" className="size-3 opacity-50" />
                  )}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                </Link>

                {"children" in link && link.children && (
                  <div className="invisible absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_16px_40px_-16px_rgba(20,20,20,0.18)]">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-5 py-3 text-sm text-ink/75 transition-colors hover:bg-paper-dim hover:text-ink"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Button href="/contact-us" className="text-xs">
            {CONTACT_CTA}
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex size-10 items-center justify-center rounded-full border border-line lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <List className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line lg:hidden"
          >
            <motion.nav
              className="container-page flex flex-col gap-1 py-4"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05 } } }}
            >
              {NAV_LINKS.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, x: -12 },
                    show: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-2.5 text-base font-medium text-ink"
                  >
                    {link.label}
                  </Link>
                  {"children" in link && link.children && (
                    <div className="ml-3 flex flex-col border-l border-line pl-3">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="py-2 text-sm text-muted"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              <Button href="/contact-us" className="mt-3 w-fit">
                {CONTACT_CTA}
              </Button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
