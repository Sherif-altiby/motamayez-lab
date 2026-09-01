"use client";

import * as React from "react";
import { useDb } from "@/lib/use-db";
import { store, type Patient } from "@/lib/store";
import { useToast } from "@/components/ui/toaster";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { PatientResultsDialog } from "@/components/patient-results-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Users, FileText, Search } from "lucide-react";

type FormState = { name: string; phone: string; age: string };
const emptyForm: FormState = { name: "", phone: "", age: "" };

export function PatientsManager({ ownerType, ownerId }: { ownerType: "doctor" | "lab"; ownerId: string }) {
  const db = useDb();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Patient | null>(null);
  const [form, setForm] = React.useState<FormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = React.useState<Patient | null>(null);
  const [resultsPatient, setResultsPatient] = React.useState<Patient | null>(null);
  const [query, setQuery] = React.useState("");

  const patients = db.patients
    .filter((p) => p.ownerType === ownerType && p.ownerId === ownerId)
    .filter((p) => p.name.includes(query) || p.phone.includes(query));

  const patientColumns: DataTableColumn<Patient>[] = [
    { header: "اسم المريض", accessor: (patient) => <span className="font-semibold">{patient.name}</span> },
    { header: "رقم الهاتف", accessor: (patient) => <span dir="ltr" className="text-right">{patient.phone}</span>, cellClassName: "text-right" },
    { header: "السن", accessor: (patient) => patient.age },
    {
      header: "النتائج",
      accessor: (patient) => (
        <Badge variant={patient.results.length ? "success" : "outline"} className="gap-1">
          <FileText className="h-3 w-3" /> {patient.results.length}
        </Badge>
      ),
    },
  ];

  const patientActions = (patient: Patient) => (
    <>
      <Button variant="outline" size="sm" onClick={() => setResultsPatient(patient)}>
        النتائج
      </Button>
      <Button variant="ghost" size="icon" onClick={() => openEdit(patient)} aria-label="تعديل">
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(patient)} aria-label="حذف">
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </>
  );

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(p: Patient) {
    setEditing(p);
    setForm({ name: p.name, phone: p.phone, age: String(p.age) });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const age = Number(form.age);
    if (!form.name || !form.phone || !age || age <= 0) {
      toast({ title: "من فضلك أكمل بيانات المريض بشكل صحيح", variant: "error" });
      return;
    }
    if (editing) {
      store.updatePatient(editing.id, { name: form.name, phone: form.phone, age });
      toast({ title: "تم تحديث بيانات المريض", variant: "success" });
    } else {
      store.addPatient({ name: form.name, phone: form.phone, age, ownerType, ownerId });
      toast({ title: "تم إضافة المريض بنجاح", variant: "success" });
    }
    setOpen(false);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    store.deletePatient(deleteTarget.id);
    toast({ title: "تم حذف المريض", variant: "success" });
    setDeleteTarget(null);
  }

  // Keep the results dialog's patient object fresh after uploads/deletes.
  const liveResultsPatient = resultsPatient ? db.patients.find((p) => p.id === resultsPatient.id) ?? null : null;

  return (
    <div>
      <PageHeader
        title="مرضاي"
        description="إدارة المرضى ورفع نتائج تحاليلهم كملفات PDF"
        action={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" /> إضافة مريض
          </Button>
        }
      />

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث بالاسم أو رقم الهاتف" className="pe-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          {patients.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <Users className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">لا يوجد مرضى بعد</p>
              <Button size="sm" onClick={openAdd}>
                <Plus className="h-4 w-4" /> إضافة أول مريض
              </Button>
            </div>
          ) : (
            <DataTable
              columns={patientColumns}
              data={patients}
              rowKey={(patient) => patient.id}
              actions={patientActions}
              emptyState={
                <div className="flex flex-col items-center gap-2 py-16 text-center">
                  <Users className="h-10 w-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">لا يوجد مرضى بعد</p>
                </div>
              }
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل بيانات المريض" : "إضافة مريض جديد"}</DialogTitle>
            <DialogDescription>بيانات أساسية للمريض — يمكنك رفع نتائج تحاليله بعد الإضافة.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>اسم المريض</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="الاسم بالكامل" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>رقم الهاتف</Label>
                <Input dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="01xxxxxxxxx" required />
              </div>
              <div className="space-y-1.5">
                <Label>السن</Label>
                <Input type="number" min={0} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="مثال: 32" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{editing ? "حفظ التعديلات" : "إضافة المريض"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف المريض "{deleteTarget?.name}"؟</AlertDialogTitle>
            <AlertDialogDescription>سيتم حذف بيانات المريض وكل نتائج تحاليله نهائيًا. لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>حذف نهائي</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PatientResultsDialog patient={liveResultsPatient} open={!!resultsPatient} onOpenChange={(o) => !o && setResultsPatient(null)} canEdit />
    </div>
  );
}
