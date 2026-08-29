"use client";

import * as React from "react";
import { useDb } from "@/lib/use-db";
import { store, type DoctorAccount } from "@/lib/store";
import { useToast } from "@/components/ui/toaster";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Pencil, Trash2, Stethoscope, Users } from "lucide-react";

type FormState = { name: string; phone: string; specialty: string; username: string; password: string };
const emptyForm: FormState = { name: "", phone: "", specialty: "", username: "", password: "" };

export default function DoctorsPage() {
  const db = useDb();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<DoctorAccount | null>(null);
  const [form, setForm] = React.useState<FormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = React.useState<DoctorAccount | null>(null);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(d: DoctorAccount) {
    setEditing(d);
    setForm({ name: d.name, phone: d.phone, specialty: d.specialty, username: d.username, password: d.password });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.username || !form.password) {
      toast({ title: "من فضلك أكمل البيانات المطلوبة", variant: "error" });
      return;
    }
    if (editing) {
      store.updateDoctor(editing.id, form);
      toast({ title: "تم تحديث بيانات الدكتور", variant: "success" });
    } else {
      store.addDoctor(form);
      toast({ title: "تم إضافة الدكتور بنجاح", variant: "success" });
    }
    setOpen(false);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    store.deleteDoctor(deleteTarget.id);
    toast({ title: "تم حذف الدكتور وكل مرضاه", variant: "success" });
    setDeleteTarget(null);
  }

  function patientsCount(id: string) {
    return db.patients.filter((p) => p.ownerType === "doctor" && p.ownerId === id).length;
  }

  return (
    <div>
      <PageHeader
        title="الدكاترة"
        description="إضافة وتعديل وحذف حسابات الدكاترة"
        action={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" /> إضافة دكتور
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          {db.doctors.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <Stethoscope className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">لا يوجد دكاترة مضافين بعد</p>
              <Button size="sm" onClick={openAdd}>
                <Plus className="h-4 w-4" /> إضافة أول دكتور
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>التخصص</TableHead>
                  <TableHead>رقم الهاتف</TableHead>
                  <TableHead>اسم المستخدم</TableHead>
                  <TableHead>المرضى</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {db.doctors.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-semibold">{d.name}</TableCell>
                    <TableCell>{d.specialty || "—"}</TableCell>
                    <TableCell dir="ltr" className="text-right">{d.phone}</TableCell>
                    <TableCell dir="ltr" className="text-right font-mono text-xs">{d.username}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        <Users className="h-3 w-3" /> {patientsCount(d.id)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(d)} aria-label="تعديل">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(d)} aria-label="حذف">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل بيانات الدكتور" : "إضافة دكتور جديد"}</DialogTitle>
            <DialogDescription>سيتمكن الدكتور من الدخول بهذه البيانات لإدارة مرضاه.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label>الاسم الكامل</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="د. محمد علي" required />
              </div>
              <div className="space-y-1.5">
                <Label>التخصص</Label>
                <Input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} placeholder="مثال: أطفال" />
              </div>
              <div className="space-y-1.5">
                <Label>رقم الهاتف</Label>
                <Input dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="01xxxxxxxxx" />
              </div>
              <div className="space-y-1.5">
                <Label>اسم المستخدم</Label>
                <Input dir="ltr" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label>كلمة المرور</Label>
                <Input dir="ltr" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{editing ? "حفظ التعديلات" : "إضافة الدكتور"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الدكتور "{deleteTarget?.name}"؟</AlertDialogTitle>
            <AlertDialogDescription>سيتم حذف الدكتور وكل مرضاه ونتائجهم نهائيًا. لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>حذف نهائي</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
