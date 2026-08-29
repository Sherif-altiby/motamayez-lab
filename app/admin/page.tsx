"use client";

import { useDb } from "@/lib/use-db";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, FlaskConical, Users, FileText } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const db = useDb();
  const totalResults = db.patients.reduce((sum, p) => sum + p.results.length, 0);

  const stats = [
    { label: "الدكاترة", value: db.doctors.length, icon: <Stethoscope className="h-5 w-5" />, href: "/admin/doctors" },
    { label: "معامل التحاليل", value: db.labs.length, icon: <FlaskConical className="h-5 w-5" />, href: "/admin/labs" },
    { label: "إجمالي المرضى", value: db.patients.length, icon: <Users className="h-5 w-5" />, href: "/admin/patients" },
    { label: "نتائج مرفوعة", value: totalResults, icon: <FileText className="h-5 w-5" />, href: "/admin/patients" },
  ];

  const recentPatients = [...db.patients].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 6);

  function ownerName(p: (typeof db.patients)[number]) {
    if (p.ownerType === "doctor") return db.doctors.find((d) => d.id === p.ownerId)?.name ?? "—";
    return db.labs.find((l) => l.id === p.ownerId)?.name ?? "—";
  }

  return (
    <div>
      <PageHeader title="لوحة التحكم" description="نظرة عامة على المتميز لاب — الدكاترة والمعامل والمرضى" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="mt-1 font-display text-2xl font-extrabold text-brand-navy">{s.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-tint text-primary">{s.icon}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>أحدث المرضى المضافين</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentPatients.length === 0 && <p className="text-sm text-muted-foreground">لا يوجد مرضى بعد.</p>}
          {recentPatients.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.ownerType === "doctor" ? "دكتور" : "معمل"}: {ownerName(p)}
                </p>
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
