"use client";

import { RoleGuard } from "@/components/role-guard";
import { DashboardShell, type NavItem } from "@/components/dashboard-shell";
import { Users } from "lucide-react";

const navItems: NavItem[] = [{ href: "/lab", label: "مرضاي", icon: <Users className="h-4 w-4" /> }];

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="lab">
      <DashboardShell navItems={navItems} roleBadge="حساب معمل">
        {children}
      </DashboardShell >
    </RoleGuard>
  );
}
