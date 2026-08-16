"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MailOutlined, LinkedinFilled, InstagramFilled } from "@ant-design/icons";
import { NAV_LINKS, OFFICES, MAP_LOCATIONS, SITE, CONTACT_CTA } from "@/lib/content";
import { Button } from "@/components/ui/Button";

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const el = footerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
  }

  return (
    <footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden bg-ink bg-grid-dark text-paper"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(560px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(218,36,13,0.14), transparent 70%)",
        }}
      />
      <div className="container-page relative py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr] md:gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Image
              src="/images/finbook-ltd-logo-white.png"
              alt="Finbook Ltd"
              width={632}
              height={1145}
              className="h-16 w-auto md:h-20"
            />
            <p className="mt-4 text-sm leading-relaxed text-paper/60">
              {SITE.description}
            </p>
            <Button href="/contact-us" variant="ghost" className="mt-5">
              {CONTACT_CTA}
            </Button>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-paper/45">
              Navigate
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-paper/70 transition-colors hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-paper/45">
              Offices
            </h3>
            <ul className="mt-5 flex flex-col gap-4">
              {OFFICES.map((office) => (
                <li key={office.country} className="text-sm text-paper/70">
                  <p className="font-medium text-paper/90">{office.country}</p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      office.address,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 block text-paper/55 hover:text-paper"
                  >
                    {office.address}
                  </a>
                  <a href={`tel:${office.phoneHref}`} className="mt-0.5 block hover:text-paper">
                    {office.phone}
                  </a>
                </li>
              ))}
            </ul>

            {MAP_LOCATIONS[0] && (
              <a
                href={`https://www.openstreetmap.org/?mlat=${MAP_LOCATIONS[0].lat}&mlon=${MAP_LOCATIONS[0].lng}#map=16/${MAP_LOCATIONS[0].lat}/${MAP_LOCATIONS[0].lng}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open a larger map of the Finbook ${MAP_LOCATIONS[0].label} office`}
                className="relative mt-4 block aspect-square w-full max-w-[120px] overflow-hidden rounded-xl border border-paper/10"
              >
                {/* OSM's embed UI (zoom buttons, attribution text) doesn't fit
                    a box this small, so the iframe is rendered at a larger
                    intrinsic size and scaled down, keeping that UI legible
                    instead of overflowing the clipped container. */}
                <iframe
                  title={`Map showing the Finbook ${MAP_LOCATIONS[0].label} office`}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    MAP_LOCATIONS[0].lng - 0.006
                  }%2C${MAP_LOCATIONS[0].lat - 0.006}%2C${MAP_LOCATIONS[0].lng + 0.006}%2C${
                    MAP_LOCATIONS[0].lat + 0.006
                  }&layer=mapnik&marker=${MAP_LOCATIONS[0].lat}%2C${MAP_LOCATIONS[0].lng}`}
                  loading="lazy"
                  className="pointer-events-none absolute left-0 top-0 h-[250%] w-[250%] origin-top-left scale-[0.4] grayscale transition-[filter] duration-500 hover:grayscale-0"
                />
              </a>
            )}
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-paper/45">
              Connect
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-2 text-sm text-paper/70 hover:text-paper"
                >
                  <MailOutlined className="[&>svg]:size-4" />
                  {SITE.email}
                </a>
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Finbook Global on LinkedIn"
                className="flex size-9 items-center justify-center rounded-full border border-paper/20 transition-colors hover:border-paper/60"
              >
                <LinkedinFilled className="[&>svg]:size-4" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Finbook Global on Instagram"
                className="flex size-9 items-center justify-center rounded-full border border-paper/20 transition-colors hover:border-paper/60"
              >
                <InstagramFilled className="[&>svg]:size-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-paper/10 pt-6 text-xs text-paper/45 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {SITE.legalName}. We do not provide services that
            require a license to practice public accountancy.
          </p>
          <div className="flex gap-5">
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
