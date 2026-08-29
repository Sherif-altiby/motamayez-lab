"use client";

import * as React from "react";
import { useDb } from "@/lib/use-db";
import type { Patient } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PatientResultsDialog } from "@/components/patient-results-dialog";
import { Users, FileText, Search } from "lucide-react";

export default function AllPatientsPage() {
  const db = useDb();
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Patient | null>(null);

  function ownerName(p: Patient) {
    if (p.ownerType === "doctor") return db.doctors.find((d) => d.id === p.ownerId)?.name ?? "—";
    return db.labs.find((l) => l.id === p.ownerId)?.name ?? "—";
  }

  const filtered = db.patients.filter(
    (p) => p.name.includes(query) || p.phone.includes(query) || ownerName(p).includes(query)
  );

  return (
    <div>
      <PageHeader title="كل المرضى" description="عرض جميع مرضى الدكاترة والمعامل ونتائج تحاليلهم" />

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث بالاسم أو الهاتف أو الدكتور/المعمل" className="pe-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <Users className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">لا يوجد مرضى مطابقين</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم المريض</TableHead>
                  <TableHead>الهاتف</TableHead>
                  <TableHead>السن</TableHead>
                  <TableHead>تابع لـ</TableHead>
                  <TableHead>النتائج</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-semibold">{p.name}</TableCell>
                    <TableCell dir="ltr" className="text-right">{p.phone || "—"}</TableCell>
                    <TableCell>{p.age}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline">{p.ownerType === "doctor" ? "دكتور" : "معمل"}</Badge>
                        <span className="text-sm">{ownerName(p)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.results.length ? "success" : "outline"} className="gap-1">
                        <FileText className="h-3 w-3" /> {p.results.length}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelected(p)}>
                        عرض النتائج
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <PatientResultsDialog patient={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} canEdit={false} />
    </div>
  );
}
