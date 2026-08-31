"use client";

import { useDb } from "@/lib/use-db";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, FlaskConical, Users, FileText, ArrowUpLeft, Inbox } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const db = useDb();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totalResults = db.patients.reduce((sum, p) => sum + p.results.length, 0);

  const stats = [
    {
      label: "الدكاترة",
      value: db.doctors.length,
      icon: <Stethoscope className="h-5 w-5" />,
      href: "/admin/doctors",
      tint: "bg-brand-tint text-primary",
      ring: "group-hover:ring-primary/20",
    },
    {
      label: "معامل التحاليل",
      value: db.labs.length,
      icon: <FlaskConical className="h-5 w-5" />,
      href: "/admin/labs",
      tint: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
      ring: "group-hover:ring-violet-500/20",
    },
    {
      label: "إجمالي المرضى",
      value: db.patients.length,
      icon: <Users className="h-5 w-5" />,
      href: "/admin/patients",
      tint: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
      ring: "group-hover:ring-emerald-500/20",
    },
    {
      label: "نتائج مرفوعة",
      value: totalResults,
      icon: <FileText className="h-5 w-5" />,
      href: "/admin/patients",
      tint: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
      ring: "group-hover:ring-amber-500/20",
    },
  ];

  const recentPatients = [...db.patients]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 6);

  function ownerName(p: (typeof db.patients)[number]) {
    if (p.ownerType === "doctor") return db.doctors.find((d) => d.id === p.ownerId)?.name ?? "—";
    return db.labs.find((l) => l.id === p.ownerId)?.name ?? "—";
  }

  function initials(name: string) {
    return name.trim().slice(0, 1);
  }

  return (
    <div>
      <PageHeader
        title="لوحة التحكم"
        description="نظرة عامة على المتميز لاب — الدكاترة والمعامل والمرضى"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Link key={s.label} href={s.href} className="group">
            <Card
              className={`relative overflow-hidden border-border/60 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-navy/5 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: mounted ? `${i * 60}ms` : "0ms" }}
            >
              <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-white/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-white/5" />
              <CardContent className="relative flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="mt-1 font-display text-2xl font-extrabold tabular-nums text-brand-navy transition-transform duration-300 group-hover:scale-105">
                    {s.value}
                  </p>
                </div>
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-4 ring-transparent transition-all duration-300 group-hover:scale-110 ${s.tint} ${s.ring}`}
                >
                  {s.icon}
                </div>
              </CardContent>
              <ArrowUpLeft className="absolute bottom-3 left-3 h-3.5 w-3.5 -translate-x-1 translate-y-1 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-40" />
            </Card>
          </Link>
        ))}
      </div>

      <Card
        className={`mt-6 border-border/60 transition-all duration-500 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
        style={{ transitionDelay: mounted ? "240ms" : "0ms" }}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>أحدث المرضى المضافين</CardTitle>
          <Link
            href="/admin/patients"
            className="text-xs font-medium text-primary transition-colors hover:text-brand-deep"
          >
            عرض الكل
          </Link>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {recentPatients.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
              <Inbox className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">لا يوجد مرضى بعد.</p>
            </div>
          )}
          {recentPatients.map((p, i) => (
            <div
              key={p.id}
              className={`group flex items-center justify-between rounded-lg border border-border p-3 transition-all duration-300 hover:border-primary/30 hover:bg-brand-mist dark:hover:bg-primary/5 ${
                mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
              }`}
              style={{ transitionDelay: mounted ? `${300 + i * 40}ms` : "0ms" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-tint text-sm font-bold text-primary transition-transform duration-300 group-hover:scale-105">
                  {initials(p.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.ownerType === "doctor" ? "دكتور" : "معمل"}: {ownerName(p)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={p.results.length ? "success" : "outline"}>{p.results.length} نتيجة</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}