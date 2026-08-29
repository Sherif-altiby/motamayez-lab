import { cn } from "@/lib/utils";

export function LogoMark({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("h-8 w-8", className)} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="11" fill={light ? "#FFFFFF" : "#1657C7"} />
      <path
        d="M17 8h6v7.2l5.4 10.1c1 1.9-.4 4.2-2.6 4.2H14.2c-2.2 0-3.6-2.3-2.6-4.2L17 15.2V8Z"
        fill={light ? "#1657C7" : "#FFFFFF"}
        fillOpacity={light ? 1 : 0.95}
      />
      <path d="M14.6 22.5h10.8" stroke={light ? "#FFFFFF" : "#1657C7"} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="19" cy="26.2" r="1.15" fill={light ? "#FFFFFF" : "#1657C7"} />
      <circle cx="22.3" cy="27.6" r="0.85" fill={light ? "#FFFFFF" : "#1657C7"} />
      <path d="M16 8h8" stroke={light ? "#FFFFFF" : "#1657C7"} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, light = false, subtitle }: { className?: string; light?: boolean; subtitle?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark light={light} />
      <div className="leading-tight">
        <p className={cn("font-display text-lg font-extrabold tracking-tight", light ? "text-white" : "text-brand-navy")}>
          المتميز <span className={light ? "text-white/80" : "text-primary"}>لاب</span>
        </p>
        {subtitle && <p className={cn("text-[11px] font-medium", light ? "text-white/70" : "text-muted-foreground")}>{subtitle}</p>}
      </div>
    </div>
  );
}
