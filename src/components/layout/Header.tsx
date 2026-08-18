"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MenuOutlined, CloseOutlined, CaretDownOutlined } from "@ant-design/icons";
import { NAV_LINKS } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const HEADER_LINKS = NAV_LINKS.filter((link) => link.href !== "/contact-us");

export function Header() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("/").slice(0, 2).join("/"));
  }

  // Close the mobile menu on scroll or on any click/tap outside it, since
  // it's an inline panel (not a scroll-locked overlay) -- it should get out
  // of the way as soon as the user starts reading the page again.
  useEffect(() => {
    if (!open) return;

    function handleScroll() {
      setOpen(false);
    }

    function handleOutside(e: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("pointerdown", handleOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("pointerdown", handleOutside);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-paper/10 bg-ink/95 text-paper backdrop-blur-md"
    >
      <div className="border-b border-paper/10 bg-ink-soft px-4 py-2 text-center text-paper md:py-2.5">
        <p className="mx-auto max-w-6xl text-balance font-mono text-[11px] leading-relaxed tracking-[0.12em] sm:text-xs md:text-sm md:tracking-[0.16em]">
          Onboarding new UK clients for the 2026/27 filing year — limited capacity.
        </p>
      </div>

      <div className="container-page flex h-16 items-center justify-between md:h-[72px]">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <motion.div whileHover={{ rotate: -4, scale: 1.03 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
            <Image
              src="/images/finbook-ltd-logo-white.png"
              alt="Finbook Ltd"
              width={2150}
              height={833}
              className="h-9 w-auto md:h-10"
              priority
            />
          </motion.div>
        </Link>

        <nav
          className="hidden items-center gap-8 lg:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {HEADER_LINKS.map((link) => {
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
                    "relative flex items-center gap-1 py-1.5 text-sm font-medium text-paper/65 transition-colors hover:text-paper",
                    active && "text-paper",
                  )}
                >
                  {link.label}
                  {"children" in link && link.children && (
                    <CaretDownOutlined className="[&>svg]:size-3 opacity-50" />
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
                    <div className="overflow-hidden rounded-md border border-paper/10 bg-ink-soft shadow-[0_18px_50px_-20px_rgba(0,0,0,0.55)]">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-5 py-3 text-sm text-paper/70 transition-colors hover:bg-teal/10 hover:text-paper"
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
            Contact
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex size-10 items-center justify-center rounded-md border border-paper/20 text-paper lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseOutlined className="[&>svg]:size-5" /> : <MenuOutlined className="[&>svg]:size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-paper/10 bg-ink lg:hidden"
          >
            <motion.nav
              className="container-page flex flex-col gap-1 py-4"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05 } } }}
            >
              {HEADER_LINKS.map((link) => (
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
                    className="block py-2.5 text-base font-medium text-paper"
                  >
                    {link.label}
                  </Link>
                  {"children" in link && link.children && (
                    <div className="ml-3 flex flex-col border-l border-paper/15 pl-3">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="py-2 text-sm text-paper/60"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              <Button href="/contact-us" className="mt-3 w-fit">
                Contact
              </Button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
