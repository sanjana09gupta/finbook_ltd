"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  EnvironmentOutlined,
  InstagramFilled,
  LinkedinFilled,
  MailOutlined,
} from "@ant-design/icons";
import { NAV_LINKS, OFFICES, SITE } from "@/lib/content";

const OFFICE_LABELS = ["India", "UK", "USA"] as const;

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [activeOffice, setActiveOffice] = useState<number | null>(null);
  const pathname = usePathname();
  const isContactPage = pathname === "/contact-us";

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const el = footerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
  }

  function toggleOffice(index: number) {
    setActiveOffice((current) => (current === index ? null : index));
  }

  const selectedOffice = activeOffice === null ? null : OFFICES[activeOffice];

  return (
    <footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden border-t-[40px] border-paper-dim bg-ink bg-grid-dark text-paper"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(560px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(126,184,176,0.14), transparent 70%)",
        }}
      />

      <div className={`container-page relative ${isContactPage ? "py-5 md:py-7" : "py-8 md:py-14"}`}>
        <nav aria-label="Footer navigation">
          <ul className="flex gap-5 overflow-x-auto whitespace-nowrap border-b border-paper/10 pb-4 text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-8 md:text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-paper/65 transition-colors hover:text-teal">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className={
            isContactPage
              ? "mt-4"
              : "mt-6 grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:gap-12"
          }
        >
          <div>
            {!isContactPage && (
              <p className="max-w-md text-xs leading-relaxed text-paper/55 md:text-sm">
                {SITE.description}
              </p>
            )}
            <div className={`${isContactPage ? "mt-0" : "mt-4"} flex flex-wrap items-center gap-2.5`}>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2 text-xs text-paper/70 transition-colors hover:text-paper md:text-sm"
              >
                <MailOutlined className="[&>svg]:size-4" />
                {SITE.email}
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Finbook Global on LinkedIn"
                className="flex size-8 items-center justify-center rounded-full border border-paper/20 transition-colors hover:border-teal hover:text-teal"
              >
                <LinkedinFilled className="[&>svg]:size-3.5" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Finbook Global on Instagram"
                className="flex size-8 items-center justify-center rounded-full border border-paper/20 transition-colors hover:border-teal hover:text-teal"
              >
                <InstagramFilled className="[&>svg]:size-3.5" />
              </a>
            </div>
          </div>

          {!isContactPage && <section aria-labelledby="footer-offices">
            <h2 id="footer-offices" className="text-[10px] font-medium uppercase tracking-[0.18em] text-paper/45">
              Select an office
            </h2>
            <div className="mt-3 flex gap-2">
              {OFFICES.map((office, index) => {
                const active = activeOffice === index;
                return (
                  <button
                    key={office.country}
                    type="button"
                    aria-expanded={active}
                    aria-pressed={active}
                    aria-controls="footer-office-details"
                    onClick={() => toggleOffice(index)}
                    className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal ${
                      active
                        ? "border-teal bg-teal text-ink"
                        : "border-paper/20 text-paper/65 hover:border-teal hover:text-teal"
                    }`}
                  >
                    <EnvironmentOutlined className="[&>svg]:size-3.5" />
                    {OFFICE_LABELS[index] ?? office.country}
                  </button>
                );
              })}
            </div>

            <div id="footer-office-details" aria-live="polite" className="min-h-16">
              {selectedOffice && (
                <div className="mt-3 border-l-2 border-teal pl-3 text-xs leading-relaxed text-paper/60">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      selectedOffice.address,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block max-w-md hover:text-paper"
                  >
                    {selectedOffice.address}
                  </a>
                  <a href={`tel:${selectedOffice.phoneHref}`} className="mt-1 inline-block text-teal hover:text-paper">
                    {selectedOffice.phone}
                  </a>
                </div>
              )}
            </div>
          </section>}
        </div>

        <div className={`${isContactPage ? "mt-4" : "mt-5"} flex flex-col gap-2 border-t border-paper/10 pt-4 text-[10px] leading-relaxed text-paper/40 sm:flex-row sm:items-center sm:justify-between md:text-xs`}>
          <p>
            &copy; {new Date().getFullYear()} {SITE.legalName}. We do not provide services that
            require a license to practice public accountancy.
          </p>
          <div className="flex shrink-0 gap-4">
            <Link href="/privacy-policy" className="hover:text-paper/70">
              Privacy policy
            </Link>
            <Link href="/terms-condition" className="hover:text-paper/70">
              Terms &amp; conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
