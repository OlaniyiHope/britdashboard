import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

type Props = {
  value: string; // "YYYY-MM-DDTHH:mm" (24-hour) or ""
  onChange: (value: string) => void;
};

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

const selectClass =
  "h-10 w-full rounded-md border border-input bg-background px-3 pr-8 text-sm outline-none focus:ring-2 focus:ring-ring";

const labelClass = "text-xs font-medium text-muted-foreground";

type Parts = { date: string; hour: string; minute: string; period: "AM" | "PM" };

// "2026-11-04T13:30" -> { date, hour: "1", minute: "30", period: "PM" }
const parse = (value: string): Parts => {
  const [date = "", time = ""] = value ? value.split("T") : [];
  const [hh = "", mm = ""] = time.split(":");
  if (hh === "") return { date, hour: "", minute: "", period: "AM" };

  const h24 = Number(hh);
  return {
    date,
    hour: String(h24 % 12 || 12),
    minute: mm,
    period: h24 >= 12 ? "PM" : "AM",
  };
};

// Only returns a value when all four parts are chosen
const build = ({ date, hour, minute, period }: Parts) => {
  if (!date || !hour || !minute) return "";
  let h = Number(hour) % 12;
  if (period === "PM") h += 12;
  return `${date}T${String(h).padStart(2, "0")}:${minute}`;
};

export function DateTime12hPicker({ value, onChange }: Props) {
  const [parts, setParts] = useState<Parts>(() => parse(value));

  // Remember what we last sent up, so a value we emitted ourselves
  // doesn't reset the local selections.
  const lastEmitted = useRef(value);

  useEffect(() => {
    if (value !== lastEmitted.current) {
      lastEmitted.current = value;
      setParts(parse(value));
    }
  }, [value]);

  const update = (patch: Partial<Parts>) => {
    const next = { ...parts, ...patch };
    setParts(next);

    const out = build(next);
    lastEmitted.current = out;
    onChange(out);
  };

  return (
    <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.9fr)] gap-2">
      <div className="space-y-1">
        <span className={labelClass}>Date</span>
        <Input
          type="date"
          value={parts.date}
          onChange={(e) => update({ date: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <span className={labelClass}>Hour</span>
        <select
          className={selectClass}
          value={parts.hour}
          onChange={(e) => update({ hour: e.target.value })}
        >
          <option value="">--</option>
          {HOURS.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <span className={labelClass}>Min</span>
        <select
          className={selectClass}
          value={parts.minute}
          onChange={(e) => update({ minute: e.target.value })}
        >
          <option value="">--</option>
          {MINUTES.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <span className={labelClass}>AM/PM</span>
        <select
          className={selectClass}
          value={parts.period}
          onChange={(e) => update({ period: e.target.value as "AM" | "PM" })}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}