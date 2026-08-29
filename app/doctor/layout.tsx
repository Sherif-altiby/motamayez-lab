"use client";

import { RoleGuard } from "@/components/role-guard";
import { DashboardShell, type NavItem } from "@/components/dashboard-shell";
import { Users } from "lucide-react";

const navItems: NavItem[] = [{ href: "/doctor", label: "مرضاي", icon: <Users className="h-4 w-4" /> }];

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="doctor">
      <DashboardShell navItems={navItems} roleBadge="حساب دكتور">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
