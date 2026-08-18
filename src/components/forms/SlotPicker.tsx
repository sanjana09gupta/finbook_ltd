"use client";

import { useEffect, useMemo, useState } from "react";
import { LeftOutlined, RightOutlined, LoadingOutlined } from "@ant-design/icons";

export interface Slot {
  start: string;
  end: string;
}

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_LABEL = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });

// A fixed locale keeps this identical between the server render and the
// client hydration pass -- `undefined` resolves to whatever ICU locale the
// runtime defaults to, which differs between Node and the browser and was
// causing a hydration mismatch.
function formatSlotLabel(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" });
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

  function goToToday() {
    setDate(today);
  }

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
    setSlots([]);
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
    <div className="flex flex-col items-start gap-2">
      <span className="text-sm font-medium text-ink">Choose a day and time</span>
      <div className="flex w-full max-w-[420px] flex-col rounded-2xl border border-line bg-paper shadow-sm md:w-auto md:max-w-none">
        <div className="flex flex-col md:flex-row">
          <div className="w-full shrink-0 p-4 md:w-72">
            <div className="mb-3 grid grid-cols-[auto_1fr_auto] items-center">
              <button
                type="button"
                aria-label="Previous month"
                disabled={!canGoPrev}
                onClick={() => changeMonth(-1)}
                className="flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper-dim disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <LeftOutlined className="[&>svg]:size-4" />
              </button>
              <span className="text-center text-sm font-semibold text-ink">{MONTH_LABEL.format(new Date(viewYear, viewMonth - 1, 1))}</span>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => changeMonth(1)}
                className="flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper-dim"
              >
                <RightOutlined className="[&>svg]:size-4" />
              </button>
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
                const isToday = cell.iso === today;
                return (
                  <button
                    key={cell.iso}
                    type="button"
                    disabled={disabled}
                    onClick={() => setDate(cell.iso)}
                    className={`relative aspect-square rounded-full text-sm transition-colors ${
                      selected
                        ? "bg-accent text-ink"
                        : disabled
                          ? "cursor-not-allowed text-muted/50"
                          : "text-ink hover:bg-paper-dim"
                    }`}
                  >
                    {cell.day}
                    {isToday && (
                      <span
                        className={`absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full ${selected ? "bg-paper" : "bg-accent"}`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col border-t border-line md:w-48 md:border-t-0 md:border-l">
            <span className="px-4 pt-4 pb-2 text-center text-sm font-semibold text-ink">Available times</span>
            {status === "loading" && (
              <div className="flex flex-col items-center gap-2 px-4 py-6 text-sm text-muted">
                <LoadingOutlined className="[&>svg]:size-[18px] animate-spin text-accent" />
                Fetching available times…
              </div>
            )}
            {status === "error" && (
              <p className="px-4 py-3 text-center text-sm text-accent">Couldn&apos;t load times. Try another day.</p>
            )}
            {status === "idle" && slots.length === 0 && (
              <p className="px-4 py-3 text-center text-sm text-muted">No open times. Try another day.</p>
            )}
            {slots.length > 0 && (
              <ul className="flex flex-col gap-1.5 pl-3 pr-1.5 pb-3 md:max-h-64 md:overflow-y-auto md:[scrollbar-width:thin] md:[&::-webkit-scrollbar]:w-1.5 md:[&::-webkit-scrollbar-thumb]:rounded-full md:[&::-webkit-scrollbar-thumb]:bg-line md:[&::-webkit-scrollbar-track]:bg-transparent">
                {slots.map((slot) => {
                  const selected = selectedSlot?.start === slot.start;
                  return (
                    <li key={slot.start}>
                      <button
                        type="button"
                        onClick={() => onSelect(slot)}
                        className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                          selected
                            ? "border-accent bg-accent text-ink"
                            : "border-line bg-paper text-ink hover:border-accent"
                        }`}
                      >
                        {formatSlotLabel(slot.start)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-line p-3">
          <span className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink">
            {new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}
          </span>
          <button
            type="button"
            onClick={goToToday}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
              date === today ? "border-accent text-accent" : "border-line text-ink hover:bg-paper-dim"
            }`}
          >
            Today
          </button>
        </div>
      </div>
    </div>
  );
}
