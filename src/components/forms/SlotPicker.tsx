"use client";

import { useEffect, useMemo, useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";

export interface Slot {
  start: string;
  end: string;
}

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_LABEL = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" });

function formatSlotLabel(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toIso(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function todayIso() {
  const d = new Date();
  return toIso(d.getFullYear(), d.getMonth(), d.getDate());
}

type DayCell = { iso: string; day: number; inMonth: boolean; isPast: boolean; isWeekend: boolean };

function buildMonthGrid(year: number, month: number, todayStr: string): DayCell[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const cells: DayCell[] = [];

  for (let i = firstWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    cells.push({ iso: "", day, inMonth: false, isPast: true, isWeekend: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = toIso(year, month, day);
    const weekday = new Date(year, month, day).getDay();
    cells.push({ iso, day, inMonth: true, isPast: iso < todayStr, isWeekend: weekday === 0 || weekday === 6 });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ iso: "", day: cells.length, inMonth: false, isPast: true, isWeekend: false });
  }
  return cells;
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
  const today = useMemo(() => todayIso(), []);
  const [date, setDate] = useState(today);
  const [viewYear, viewMonth] = date.split("-").map(Number).slice(0, 2) as [number, number];
  const [slots, setSlots] = useState<Slot[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const grid = useMemo(() => buildMonthGrid(viewYear, viewMonth - 1, today), [viewYear, viewMonth, today]);
  const canGoPrev = !(viewYear === Number(today.slice(0, 4)) && viewMonth === Number(today.slice(5, 7)));

  function changeMonth(delta: number) {
    const next = new Date(viewYear, viewMonth - 1 + delta, 1);
    setDate((current) => {
      const day = Math.min(Number(current.slice(8, 10)), new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate());
      const candidate = toIso(next.getFullYear(), next.getMonth(), day);
      return candidate < today ? today : candidate;
    });
  }

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
        <span className="text-sm font-medium text-ink">Choose a day</span>
        <div className="w-fit rounded-2xl border border-line bg-paper p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">{MONTH_LABEL.format(new Date(viewYear, viewMonth - 1, 1))}</span>
            <div className="flex gap-1">
              <button
                type="button"
                aria-label="Previous month"
                disabled={!canGoPrev}
                onClick={() => changeMonth(-1)}
                className="rounded-full p-1.5 text-ink transition-colors hover:bg-paper-dim disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <CaretLeft size={16} weight="bold" />
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => changeMonth(1)}
                className="rounded-full p-1.5 text-ink transition-colors hover:bg-paper-dim"
              >
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">
            {WEEKDAY_LABELS.map((label) => (
              <span key={label} className="py-1">
                {label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {grid.map((cell, i) => {
              if (!cell.inMonth) return <span key={i} className="aspect-square" />;
              const disabled = cell.isPast || cell.isWeekend;
              const selected = cell.iso === date;
              return (
                <button
                  key={cell.iso}
                  type="button"
                  disabled={disabled}
                  onClick={() => setDate(cell.iso)}
                  className={`aspect-square rounded-full text-sm transition-colors ${
                    selected
                      ? "bg-ink text-paper"
                      : disabled
                        ? "cursor-not-allowed text-muted/50"
                        : "text-ink hover:bg-paper-dim"
                  }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
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
