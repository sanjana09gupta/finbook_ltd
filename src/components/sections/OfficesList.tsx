"use client";

import { EnvironmentOutlined, PhoneOutlined } from "@ant-design/icons";
import { OFFICES } from "@/lib/content";

export function OfficesList() {
  return (
    <div className="flex flex-col gap-8">
      {OFFICES.map((office) => (
        <div key={office.country} className="border-t border-line pt-6 first:border-t-0 first:pt-0">
          <h3 className="text-lg font-medium tracking-tight text-ink">{office.country}</h3>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              office.address,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-start gap-2.5 text-sm leading-relaxed text-muted hover:text-ink"
          >
            <EnvironmentOutlined className="mt-0.5 [&>svg]:size-4 shrink-0 text-accent" />
            {office.address}
          </a>
          <a
            href={`tel:${office.phoneHref}`}
            className="mt-2 flex items-center gap-2.5 text-sm text-ink/80 hover:text-ink"
          >
            <PhoneOutlined className="[&>svg]:size-4 shrink-0 text-accent" />
            {office.phone}
          </a>
        </div>
      ))}
    </div>
  );
}
