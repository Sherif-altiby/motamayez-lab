"use client";

import { RoleGuard } from "@/components/role-guard";
import { DashboardShell, type NavItem } from "@/components/dashboard-shell";
import { LayoutDashboard, Stethoscope, FlaskConical, Users, UserCircle2 } from "lucide-react";

const navItems: NavItem[] = [
  { href: "/admin", label: "لوحة التحكم", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/admin/doctors", label: "الدكاترة", icon: <Stethoscope className="h-4 w-4" /> },
  { href: "/admin/labs", label: "معامل التحاليل", icon: <FlaskConical className="h-4 w-4" /> },
  { href: "/admin/patients", label: "كل المرضى", icon: <Users className="h-4 w-4" /> },
  // { href: "/admin/profile", label: "الملف الشخصي", icon: <UserCircle2 className="h-4 w-4" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="admin">
      <DashboardShell navItems={navItems} roleBadge="مدير النظام">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
