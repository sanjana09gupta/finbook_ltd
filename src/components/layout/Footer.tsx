import Image from "next/image";
import Link from "next/link";
import { EnvelopeSimple, LinkedinLogo, FacebookLogo } from "@phosphor-icons/react/dist/ssr";
import { NAV_LINKS, OFFICES, SITE, CONTACT_CTA } from "@/lib/content";
import { Button } from "@/components/ui/Button";

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="container-page py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr] md:gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Image
              src="/images/finbook-logo-white.svg"
              alt="Finbook Global"
              width={123}
              height={58}
              className="h-10 w-auto"
            />
            <p className="mt-5 text-sm leading-relaxed text-paper/60">
              {SITE.description}
            </p>
            <Button href="/contact-us" variant="ghost" className="mt-6">
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
                  <a href={`tel:${office.phoneHref}`} className="mt-0.5 block hover:text-paper">
                    {office.phone}
                  </a>
                </li>
              ))}
            </ul>
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
                  <EnvelopeSimple className="size-4" />
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
                <LinkedinLogo className="size-4" />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Finbook Global on Facebook"
                className="flex size-9 items-center justify-center rounded-full border border-paper/20 transition-colors hover:border-paper/60"
              >
                <FacebookLogo className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-paper/10 pt-6 text-xs text-paper/45 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Finbook Global. We do not provide services that
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
