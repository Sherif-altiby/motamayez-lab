"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Stethoscope, FlaskConical, ShieldCheck, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLE_META: Record<string, { label: string; icon: React.ReactNode; ring: string }> = {
  admin: { label: "مسؤول", icon: <ShieldCheck className="h-3.5 w-3.5" />, ring: "ring-primary/30" },
  doctor: { label: "دكتور", icon: <Stethoscope className="h-3.5 w-3.5" />, ring: "ring-blue-400/30" },
  lab: { label: "معمل", icon: <FlaskConical className="h-3.5 w-3.5" />, ring: "ring-violet-400/30" },
};

function getInitials(name?: string) {
  if (!name) return "؟";
  return name.trim().slice(0, 2).toUpperCase();
}

export function Navbar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const role = (user.role ?? "doctor") as keyof typeof ROLE_META;
  const meta = ROLE_META[role] ?? ROLE_META.doctor;
  const avatarSrc: string | undefined = user.id ? `/api/avatar/${user.id}` : undefined;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-1 items-center justify-between px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-lg font-extrabold tracking-tight text-primary">
            المتميز لاب
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger >
              <button className="flex items-center gap-2 rounded-full py-1 ps-2.5 pe-1 transition-colors hover:bg-muted/60">
                <span className="hidden text-end sm:block">
                  <span className="block text-sm font-semibold leading-tight text-foreground">
                    {user.name}
                  </span>
                  <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    {meta.icon} {meta.label}
                  </span>
                </span>
                <Avatar className={cn("h-9 w-9 ring-2 ring-offset-2 ring-offset-background", meta.ring)}>
                  <AvatarImage src={avatarSrc} alt={user.name} />
                  <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="font-semibold">{user.name}</span>
                <span className="text-xs font-normal text-muted-foreground">{meta.label}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem >
                <Link href="/profile">
                  <UserIcon className="h-4 w-4" /> الملف الشخصي
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4" /> تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}