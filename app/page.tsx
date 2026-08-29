"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Logo, LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toaster";
import type { Role } from "@/lib/store";
import { ShieldCheck, Stethoscope, FlaskConical, ArrowLeft, FileCheck2, Users, Lock } from "lucide-react";

const roleMeta: Record<Role, { label: string; icon: React.ReactNode; hint: string }> = {
  admin: { label: "الأدمن", icon: <ShieldCheck className="h-4 w-4" />, hint: "admin / admin123" },
  doctor: { label: "دكتور", icon: <Stethoscope className="h-4 w-4" />, hint: "ahmed.sami / 12345" },
  lab: { label: "معمل تحاليل", icon: <FlaskConical className="h-4 w-4" />, hint: "alnoor.lab / 12345" },
};

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = React.useState<Role>("admin");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (user) router.replace(`/${user.role}`);
  }, [user, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = login(role, username.trim(), password);
    setSubmitting(false);
    if (!res.ok) {
      toast({ title: "تعذّر تسجيل الدخول", description: res.error, variant: "error" });
      return;
    }
    toast({ title: "تم تسجيل الدخول بنجاح", variant: "success" });
    router.push(`/${role}`);
  }

  function fillDemo() {
    const [u, p] = roleMeta[role].hint.split(" / ");
    setUsername(u);
    setPassword(p);
  }

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-navy via-brand-deep to-primary p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="brand-grid-bg absolute inset-0 opacity-40" />
        <div className="relative z-10">
          <Logo light subtitle="منصة إدارة التحاليل الطبية" />
        </div>

        <div className="relative z-10 max-w-md">
          <p className="font-display text-3xl font-extrabold leading-tight">
            كل نتائج مرضاك، <br /> في مكان واحد موثوق.
          </p>
          <p className="mt-4 text-sm leading-7 text-white/75">
            المتميز لاب يربط الأدمن والدكاترة ومعامل التحاليل في لوحة واحدة، لإدارة المرضى ورفع نتائج التحاليل كملفات
            PDF بسهولة وأمان.
          </p>

          <div className="mt-8 space-y-4">
            <Feature icon={<Users className="h-4 w-4" />} title="إدارة موحّدة" desc="الأدمن يضيف الدكاترة والمعامل ويتابعهم من مكان واحد" />
            <Feature icon={<FileCheck2 className="h-4 w-4" />} title="نتائج PDF لكل مريض" desc="كل مريض له ملف نتائج يقدر صاحبه يرفعه ويحمّله بسهولة" />
            <Feature icon={<Lock className="h-4 w-4" />} title="دخول بالأدوار" desc="كل دكتور أو معمل يشوف مرضاه فقط، والأدمن يشوف الكل" />
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/50">© {new Date().getFullYear()} المتميز لاب. جميع الحقوق محفوظة.</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center justify-center lg:hidden">
            <Logo />
          </div>

          <div className="mb-6 text-center lg:text-right">
            <h1 className="font-display text-2xl font-extrabold text-brand-navy">تسجيل الدخول</h1>
            <p className="mt-1 text-sm text-muted-foreground">اختر نوع الحساب وادخل بياناتك للمتابعة</p>
          </div>

          <Tabs value={role} onValueChange={(v) => setRole(v as Role)} className="mb-6 w-full">
            <TabsList className="grid w-full grid-cols-3">
              {(Object.keys(roleMeta) as Role[]).map((r) => (
                <TabsTrigger key={r} value={r} className="gap-1.5">
                  {roleMeta[r].icon}
                  {roleMeta[r].label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="اكتب اسم المستخدم" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              دخول
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </form>

          <div className="pulse-divider my-6" />

          <button
            type="button"
            onClick={fillDemo}
            className="w-full rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3 text-center text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            بيانات دخول تجريبية لحساب «{roleMeta[role].label}»: <span dir="ltr" className="font-mono">{roleMeta[role].hint}</span>
            <br />
            اضغط هنا لتعبئتها تلقائيًا
          </button>
        </div>
      </div>
    </main>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">{icon}</div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-white/60">{desc}</p>
      </div>
    </div>
  );
}
