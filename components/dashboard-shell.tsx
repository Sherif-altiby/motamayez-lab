"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, LogoMark } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { LogOut, Menu, PanelRightClose, PanelRightOpen, ShieldCheck, Stethoscope, FlaskConical, UserCircle2 } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

type Role = "admin" | "doctor" | "lab";

const SIDEBAR_STORAGE_KEY = "sidebar-collapsed";
const TRANSITION = "transition-all duration-300 ease-in-out";

const ROLE_META: Record<Role, { icon: React.ReactNode; ring: string }> = {
  admin: { icon: <ShieldCheck className="h-3.5 w-3.5" />, ring: "ring-primary/30" },
  doctor: { icon: <Stethoscope className="h-3.5 w-3.5" />, ring: "ring-blue-400/30" },
  lab: { icon: <FlaskConical className="h-3.5 w-3.5" />, ring: "ring-violet-400/30" },
};

export function DashboardShell({
  navItems,
  roleBadge,
  role = "doctor",
  children,
}: {
  navItems: NavItem[];
  roleBadge: string;
  role?: Role;
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored === "1") setCollapsed(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }

  const initials = (user?.name ?? "؟").trim().slice(0, 1);
  // ⚠️ adjust these field names to whatever your `useAuth()` actually returns
  const avatarSrc: string | undefined = user?.id ? `/api/avatar/${user.id}` : undefined;
  const meta = ROLE_META[role];

  const Sidebar = (
    <div className="flex h-full flex-col">
      {/* Sidebar header: logo + collapse toggle */}
      <div className={cn("flex items-center border-b border-border px-4 py-[11.5px]", collapsed ? "justify-center py-[5.5px]" : "justify-between")}>
        {!collapsed && <Logo />}
         <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "توسيع القائمة الجانبية" : "طي القائمة الجانبية"}
          className={cn("hidden lg:inline-flex shrink-0", collapsed && "mt-3")}
        >
          {collapsed ? <PanelRightOpen className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium",
                TRANSITION,
                collapsed ? "justify-center gap-0" : "gap-3",
                active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.icon}
              <span className={cn("truncate", TRANSITION, collapsed && "hidden")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className={cn("flex items-center rounded-lg bg-muted/60 p-3", TRANSITION, collapsed ? "justify-center gap-0 p-2" : "gap-3")}>
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={avatarSrc} alt={user?.name ?? ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{roleBadge}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            aria-label="تسجيل الخروج"
            title={collapsed ? "تسجيل الخروج" : undefined}
            className={cn(collapsed && "hidden")}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-30 hidden border-l border-border bg-background lg:block",
          TRANSITION,
          collapsed ? "lg:w-20" : "lg:w-64"
        )}
      >
        {Sidebar}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-brand-navy/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 right-0 w-72 bg-background shadow-xl">{Sidebar}</aside>
        </div>
      )}

      <div className={cn(TRANSITION, collapsed ? "lg:pr-20" : "lg:pr-64")}>
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3 lg:hidden">
            <button onClick={() => setMobileOpen(true)} aria-label="فتح القائمة">
              <Menu className="h-6 w-6 text-brand-navy" />
            </button>
            <LogoMark />
          </div>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger  >
                <button className="flex items-center gap-4 rounded-full py-1 ps-2.5 pe-1 transition-colors hover:bg-muted/60">
                  <span className="hidden text-end sm:block">
                    <span className="block text-sm font-semibold leading-tight text-foreground">{user?.name}</span>
                    <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                      {meta.icon} {roleBadge}
                    </span>
                  </span>
                  <Avatar className={cn("h-7 w-7 flex items-center justify-center ring-2 ring-offset-2 ring-offset-background", meta.ring)}>
                    <AvatarImage src={avatarSrc} alt={user?.name ?? ""} />
                    <AvatarFallback className="bg-primary/10 font-semibold text-primary">{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-0.5">
                  <span className="font-semibold">{user?.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">{roleBadge}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem  >
                  <Link href={`/${role}/profile`}>
                    <UserCircle2 className="h-4 w-4" /> الملف الشخصي
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" /> تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}