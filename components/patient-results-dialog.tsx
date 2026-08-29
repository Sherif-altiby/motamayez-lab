"use client";

import * as React from "react";
import { store, type Patient } from "@/lib/store";
import { useToast } from "@/components/ui/toaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Trash2, Download, Eye, Phone, Cake } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" });
}

export function PatientResultsDialog({
  patient,
  open,
  onOpenChange,
  canEdit,
}: {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  canEdit: boolean;
}) {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !patient) return;
    if (file.type !== "application/pdf") {
      toast({ title: "الملف غير مدعوم", description: "من فضلك ارفع ملف PDF فقط", variant: "error" });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: "حجم الملف كبير جدًا", description: "الحد الأقصى 8 ميجابايت", variant: "error" });
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      store.addResult(patient.id, { fileName: file.name, fileData: reader.result as string });
      toast({ title: "تم رفع نتيجة التحليل بنجاح", variant: "success" });
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.onerror = () => {
      toast({ title: "تعذّر قراءة الملف", variant: "error" });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }

  function handleDeleteResult(resultId: string) {
    if (!patient) return;
    store.deleteResult(patient.id, resultId);
    toast({ title: "تم حذف الملف", variant: "success" });
  }

  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{patient.name}</DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-3 pt-1">
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" /> <span dir="ltr">{patient.phone || "—"}</span>
            </span>
            <span className="flex items-center gap-1">
              <Cake className="h-3.5 w-3.5" /> {patient.age} سنة
            </span>
          </DialogDescription>
        </DialogHeader>

        {canEdit && (
          <div>
            <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
            <Button type="button" variant="secondary" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <Upload className="h-4 w-4" /> {uploading ? "جارٍ الرفع..." : "رفع نتيجة تحليل (PDF)"}
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground">نتائج التحاليل ({patient.results.length})</p>
          {patient.results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
              <FileText className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">لا توجد نتائج مرفوعة لهذا المريض بعد</p>
            </div>
          ) : (
            <div className="max-h-64 space-y-2 overflow-y-auto pe-1">
              {[...patient.results]
                .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))
                .map((r) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{r.fileName}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(r.uploadedAt)}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <a href={r.fileData} target="_blank" rel="noreferrer" title="عرض">
                        <Button type="button" variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </a>
                      <a href={r.fileData} download={r.fileName} title="تحميل">
                        <Button type="button" variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                      {canEdit && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteResult(r.id)} title="حذف">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
