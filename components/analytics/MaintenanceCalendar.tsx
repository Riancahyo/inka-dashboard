"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import type { CalendarEvent } from "@/services/analytics.service";

interface MaintenanceCalendarProps {
  events: CalendarEvent[];
}

const MONTH_NAMES = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];
const DAY_HEADERS = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

function statusColor(status: string) {
  switch (status) {
    case "Completed": return "bg-green-500";
    case "In Progress": return "bg-blue-500";
    case "Pending": return "bg-yellow-500";
    case "Cancelled": return "bg-gray-400";
    default: return "bg-gray-400";
  }
}

export function MaintenanceCalendar({ events }: MaintenanceCalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const eventMap = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((ev) => {
      const day = ev.date.slice(0, 10); 
      if (!map[day]) map[day] = [];
      map[day].push(ev);
    });
    return map;
  }, [events]);

  const firstDay = new Date(year, month, 1).getDay(); 
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay === 0 ? 6 : firstDay - 1);

  const prev = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const selectedEvents = selectedDay ? (eventMap[selectedDay] || []) : [];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Kalender Maintenance</CardTitle>
            <CardDescription>Jadwal pemeliharaan kereta</CardDescription>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-purple-50 px-2.5 py-1">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-semibold text-purple-600">Kalender</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={prev} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold text-gray-800">
            {MONTH_NAMES[month]} {year}
          </span>
          <Button variant="ghost" size="icon" onClick={next} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-px">
          {DAY_HEADERS.map((d) => (
            <div key={d} className="py-1 text-center text-xs font-semibold text-gray-500">{d}</div>
          ))}
        </div>

        {/* Grid cells */}
        <div className="grid grid-cols-7 gap-px rounded-lg border border-gray-100 bg-gray-100">
          {/* Blank cells before day 1 */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`blank-${i}`} className="h-16 bg-white" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayEvents = eventMap[key] || [];
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSelected = selectedDay === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedDay(isSelected ? null : key)}
                className={`relative h-16 bg-white p-1 text-left transition-colors hover:bg-gray-50 focus:outline-none ${
                  isSelected ? "ring-2 ring-inset ring-blue-400" : ""
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center text-xs font-medium ${
                    isToday
                      ? "rounded-full bg-blue-600 text-white"
                      : "text-gray-700"
                  }`}
                >
                  {day}
                </span>
                {/* Event dots */}
                <div className="mt-0.5 flex flex-wrap gap-0.5">
                  {dayEvents.slice(0, 3).map((ev, idx) => (
                    <span key={idx} className={`h-1.5 w-1.5 rounded-full ${statusColor(ev.status)}`} />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-xs text-gray-400">+{dayEvents.length - 3}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
          {[
            { label: "Completed", color: "bg-green-500" },
            { label: "In Progress", color: "bg-blue-500" },
            { label: "Pending", color: "bg-yellow-500" },
            { label: "Cancelled", color: "bg-gray-400" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
              <span className="text-xs text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Selected day detail popup */}
        {selectedDay && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="mb-2 text-xs font-semibold text-gray-600">
              {selectedDay} — {selectedEvents.length} jadwal
            </p>
            {selectedEvents.length === 0 ? (
              <p className="text-xs text-gray-400">Tidak ada jadwal maintenance</p>
            ) : (
              <div className="space-y-1.5">
                {selectedEvents.map((ev) => (
                  <div key={ev.id} className="flex items-center justify-between rounded bg-white px-2 py-1.5 shadow-sm">
                    <span className="text-xs font-medium text-gray-700">{ev.title}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${statusColor(ev.status)}`} />
                      <span className="text-xs text-gray-500">{ev.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}