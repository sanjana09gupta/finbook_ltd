"use client";

import { useEffect, useState } from "react";

export interface Slot {
  start: string;
  end: string;
}

function formatSlotLabel(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function SlotPicker({
  selectedSlot,
  onSelect,
  refreshKey,
}: {
  selectedSlot: Slot | null;
  onSelect: (slot: Slot) => void;
  refreshKey?: number;
}) {
  const [date, setDate] = useState(todayIso());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetch(`/api/booking/availability?date=${date}`)
      .then((res) => {
        if (!res.ok) throw new Error("availability request failed");
        return res.json();
      })
      .then((data: { slots: Slot[] }) => {
        if (cancelled) return;
        setSlots(data.slots);
        setStatus("idle");
      })
      .catch(() => {
        if (cancelled) return;
        setSlots([]);
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [date, refreshKey]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="booking-date" className="text-sm font-medium text-ink">
          Choose a day
        </label>
        <input
          id="booking-date"
          type="date"
          min={todayIso()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-fit rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
        />
      </div>

      {status === "loading" && <p className="text-sm text-muted">Loading available times…</p>}
      {status === "error" && <p className="text-sm text-accent">Couldn&apos;t load times. Try another day.</p>}
      {status === "idle" && slots.length === 0 && (
        <p className="text-sm text-muted">No open times on this day. Try another day.</p>
      )}

      {slots.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {slots.map((slot) => (
            <button
              key={slot.start}
              type="button"
              onClick={() => onSelect(slot)}
              className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                selectedSlot?.start === slot.start
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-paper text-ink hover:border-ink"
              }`}
            >
              {formatSlotLabel(slot.start)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
