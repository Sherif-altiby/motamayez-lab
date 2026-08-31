"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Logo, LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toaster";
import type { Role } from "@/lib/store";
import {
  ShieldCheck,
  Stethoscope,
  FlaskConical,
  ArrowLeft,
  FileCheck2,
  Users,
  Lock,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

const roleMeta: Record<
  Role,
  { label: string; icon: React.ReactNode; hint: string }
> = {
  admin: {
    label: "الأدمن",
    icon: <ShieldCheck className="h-4 w-4" />,
    hint: "admin / admin123",
  },
  doctor: {
    label: "دكتور",
    icon: <Stethoscope className="h-4 w-4" />,
    hint: "ahmed.sami / 12345",
  },
  lab: {
    label: "معمل تحاليل",
    icon: <FlaskConical className="h-4 w-4" />,
    hint: "alnoor.lab / 12345",
  },
};

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState<Role>("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) router.replace(`/${user.role}`);
  }, [user, router]);

  // Auto-fill credentials when role changes
  useEffect(() => {
    const [u, p] = roleMeta[role].hint.split(" / ");
    setUsername(u);
    setPassword(p);
  }, [role]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = login(role, username.trim(), password);
    setSubmitting(false);
    if (!res.ok) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast({
        title: "تعذّر تسجيل الدخول",
        description: res.error,
        variant: "error",
      });
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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6 sm:p-10">
        <div
          className={`w-full max-w-xl transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Card container with border, shadow, and background */}
          <div
            className={`rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/90 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 backdrop-blur-sm p-8 transition-all duration-300 hover:shadow-indigo-200/40 dark:hover:shadow-indigo-950/40 ${
              shake ? "animate-shake" : ""
            }`}
          >
            <div className="mb-8 flex items-center justify-center lg:hidden">
              <Logo />
            </div>

            <div
              className={`mb-6 text-center lg:text-right transition-all duration-700 delay-100 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                <Sparkles className="h-3 w-3" />
                مرحباً بعودتك
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                تسجيل الدخول
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                اختر نوع الحساب وادخل بياناتك للمتابعة
              </p>
            </div>

            <div
              className={`transition-all duration-700 delay-150 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Tabs
                value={role}
                onValueChange={(v) => setRole(v as Role)}
                className="mb-6 w-full"
              >
                <TabsList className="grid w-full grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
                  {(Object.keys(roleMeta) as Role[]).map((r) => (
                    <TabsTrigger
                      key={r}
                      value={r}
                      className={`
                        gap-1.5 rounded-lg py-2.5 text-xs font-medium transition-all duration-300
                        data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 
                        data-[state=active]:shadow-md data-[state=active]:shadow-slate-200/50 
                        dark:data-[state=active]:shadow-slate-900/50
                        data-[state=active]:text-slate-900 dark:data-[state=active]:text-white
                        data-[state=active]:scale-[1.02]
                        text-slate-500 dark:text-slate-400
                        hover:text-slate-700 dark:hover:text-slate-300
                        active:scale-95
                      `}
                    >
                      <span className="transition-transform duration-300 data-[state=active]:rotate-0">
                        {roleMeta[r].icon}
                      </span>
                      {roleMeta[r].label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <form
              onSubmit={handleSubmit}
              className={`space-y-4 transition-all duration-700 delay-200 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="space-y-1.5 group">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  اسم المستخدم
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="اكتب اسم المستخدم"
                    required
                    className="h-11 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 pl-10 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  />
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 transition-all duration-200 group-focus-within:text-indigo-500 group-focus-within:scale-110" />
                </div>
              </div>

              <div className="space-y-1.5 group">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-11 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 pl-10 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 transition-all duration-200 group-focus-within:text-indigo-500 group-focus-within:scale-110" />
                </div>
              </div>

              <Button
                type="submit"
                className="group relative w-full h-11 overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 bg-[length:200%_100%] bg-[position:0%_0%] hover:bg-[position:100%_0%] text-white font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300"
                size="lg"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white mr-2" />
                    جاري التسجيل...
                  </>
                ) : (
                  <>
                    دخول
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={fillDemo}
                className="w-full text-center text-xs text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200"
              >
                إعادة تعبئة بيانات الدخول التجريبية
              </button>
            </form>
          </div>

          <div
            className={`mt-6 flex items-center justify-center gap-6 transition-all duration-700 delay-300 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Feature
              icon={<FileCheck2 className="h-4 w-4 text-indigo-500" />}
              title="تقارير موثقة"
              desc="سجلات دقيقة"
            />
            <Feature
              icon={<ShieldCheck className="h-4 w-4 text-indigo-500" />}
              title="بيانات آمنة"
              desc="حماية كاملة"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800/60">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {title}
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">{desc}</p>
      </div>
    </div>
  );
}