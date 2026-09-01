"use client";

import { useDb } from "@/lib/use-db";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  FlaskConical, 
  Users, 
  FileText, 
  ArrowUpLeft, 
  Inbox,
  TrendingUp,
  TrendingDown,
  Clock,
  ChevronRight,
  Sparkles,
  Activity
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const db = useDb();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totalResults = db.patients.reduce((sum, p) => sum + p.results.length, 0);
  const avgResultsPerPatient = db.patients.length ? (totalResults / db.patients.length).toFixed(1) : 0;

  // Mock growth data (in real app, compare with previous period)
  const stats = [
    {
      label: "الدكاترة",
      value: db.doctors.length,
      icon: <Stethoscope className="h-5 w-5" />,
      href: "/admin/doctors",
      gradient: "from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20",
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      ring: "group-hover:ring-blue-400/30",
      growth: "+12%",
      trend: "up",
    },
    {
      label: "معامل التحاليل",
      value: db.labs.length,
      icon: <FlaskConical className="h-5 w-5" />,
      href: "/admin/labs",
      gradient: "from-violet-50 to-violet-100 dark:from-violet-950/30 dark:to-violet-900/20",
      iconBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      ring: "group-hover:ring-violet-400/30",
      growth: "+8%",
      trend: "up",
    },
    {
      label: "إجمالي المرضى",
      value: db.patients.length,
      icon: <Users className="h-5 w-5" />,
      href: "/admin/patients",
      gradient: "from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20",
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      ring: "group-hover:ring-emerald-400/30",
      growth: "+5%",
      trend: "up",
    },
    {
      label: "نتائج مرفوعة",
      value: totalResults,
      icon: <FileText className="h-5 w-5" />,
      href: "/admin/patients",
      gradient: "from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20",
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      ring: "group-hover:ring-amber-400/30",
      growth: `${avgResultsPerPatient} / مريض`,
      trend: "neutral",
    },
  ];

  const recentPatients = [...db.patients]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 6);

  function ownerName(p: (typeof db.patients)[number]) {
    if (p.ownerType === "doctor") return db.doctors.find((d) => d.id === p.ownerId)?.name ?? "—";
    return db.labs.find((l) => l.id === p.ownerId)?.name ?? "—";
  }

  function getOwnerTypeLabel(p: (typeof db.patients)[number]) {
    return p.ownerType === "doctor" ? "دكتور" : "معمل";
  }

  function getInitials(name: string) {
    return name.trim().slice(0, 2).toUpperCase();
  }

  function getRandomColor(name: string) {
    const colors = [
      "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
      "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
      "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
      "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
      "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300",
    ];
    const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  }

  const hasPatients = recentPatients.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="لوحة التحكم"
        description="نظرة عامة على منصة المتميز لاب — إحصائيات وتحليلات فورية"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Link key={s.label} href={s.href} className="group">
            <Card
              className={cn(
                "relative overflow-hidden border-0 shadow-sm transition-all duration-500 ease-out",
                "hover:-translate-y-2 hover:shadow-xl hover:shadow-black/5",
                "bg-gradient-to-br",
                s.gradient,
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
              style={{ transitionDelay: mounted ? `${i * 80}ms` : "0ms" }}
            >
              {/* Decorative glow */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/40 blur-2xl transition-opacity duration-500 group-hover:opacity-0 dark:bg-white/5" />
              
              {/* Animated border gradient on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <CardContent className="relative p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium text-muted-foreground/80">
                      {s.label}
                    </p>
                    <p className="font-display text-3xl font-extrabold tracking-tight text-foreground transition-transform duration-300 group-hover:scale-105">
                      {s.value}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs">
                      {s.trend === "up" && (
                        <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                          <TrendingUp className="h-3 w-3" />
                          {s.growth}
                        </span>
                      )}
                      {s.trend === "neutral" && (
                        <span className="text-muted-foreground/70">{s.growth}</span>
                      )}
                      {s.trend === "up" && (
                        <span className="text-muted-foreground/60">هذا الشهر</span>
                      )}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                      "ring-4 ring-transparent transition-all duration-300",
                      "group-hover:scale-110 group-hover:shadow-lg",
                      s.iconBg,
                      s.ring
                    )}
                  >
                    {s.icon}
                  </div>
                </div>
                <ArrowUpLeft className="absolute bottom-3 left-3 h-3.5 w-3.5 text-muted-foreground/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-muted-foreground/50" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Patients Card */}
      <Card
        className={cn(
          "border-border/40 shadow-sm transition-all duration-700 ease-out",
          "hover:shadow-md",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}
        style={{ transitionDelay: mounted ? "320ms" : "0ms" }}
      >
        <CardHeader className="border-b border-border/40 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">أحدث المرضى المضافين</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {hasPatients ? `آخر ${recentPatients.length} مريض` : "لا يوجد مرضى بعد"}
                </p>
              </div>
            </div>
            <Link
              href="/admin/patients"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all hover:text-primary/80 hover:gap-2"
            >
              عرض الكل
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {!hasPatients ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border/60 py-12 text-center transition-colors hover:border-primary/30">
              <div className="rounded-full bg-muted/50 p-4">
                <Inbox className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <div>
                <p className="font-medium text-foreground">لا يوجد مرضى بعد</p>
                <p className="text-sm text-muted-foreground">سيظهر المرضى المضافون هنا</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {recentPatients.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/admin/patients/${p.id}`}
                  className={cn(
                    "group rounded-xl border border-border/50 p-4 transition-all duration-500",
                    "hover:border-primary/30 hover:bg-muted/30 hover:shadow-sm",
                    "active:scale-[0.98]",
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                  style={{ transitionDelay: mounted ? `${400 + i * 60}ms` : "0ms" }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-transform duration-300 group-hover:scale-110",
                        getRandomColor(p.name)
                      )}
                    >
                      {getInitials(p.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {p.name}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <Badge 
                          variant="outline" 
                          className="h-5 px-1.5 text-[10px] font-normal capitalize"
                        >
                          {getOwnerTypeLabel(p)}
                        </Badge>
                        <span className="text-xs text-muted-foreground/70 truncate">
                          {ownerName(p)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge 
                          variant={p.results.length > 0 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {p.results.length} {p.results.length === 1 ? "نتيجة" : "نتائج"}
                        </Badge>
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground/50">
                          <Clock className="h-3 w-3" />
                          {new Date(p.createdAt).toLocaleDateString("ar-EG")}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Footer */}
      {hasPatients && (
        <div 
          className={cn(
            "grid grid-cols-3 gap-4 transition-all duration-700",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
          style={{ transitionDelay: mounted ? "680ms" : "0ms" }}
        >
          <Card className="border-border/40 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">متوسط النتائج</p>
                  <p className="text-lg font-bold">{avgResultsPerPatient}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي المرضى</p>
                  <p className="text-lg font-bold">{db.patients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-gradient-to-br from-violet-50/50 to-transparent dark:from-violet-950/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-violet-500/10 p-2 text-violet-600">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي النتائج</p>
                  <p className="text-lg font-bold">{totalResults}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}