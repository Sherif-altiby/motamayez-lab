import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
  className,
  subtitle,
  icon,
  gradient = false,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  gradient?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-start",
        className
      )}
    >
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-primary/3 blur-3xl" />

      {/* Main content */}
      <div className="relative flex-1 space-y-3">
        {/* Subtitle with icon */}
        {subtitle && (
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-0.5 rounded-full bg-primary/40" />
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              {icon && <span className="text-primary/60">{icon}</span>}
              {subtitle}
            </span>
          </div>
        )}

        {/* Title with optional gradient */}
        <div className="flex items-start gap-4">
          <h1
            className={cn(
              " text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl",
              gradient
                ? "bg-gradient-to-r from-foreground via-foreground/90 to-primary/70 bg-clip-text text-transparent"
                : "text-foreground"
            )}
          >
            {title}
          </h1>

          {/* Small decorative dot */}
          <span className="mt-2 hidden h-2 w-2 rounded-full bg-primary/30 sm:inline-block" />
        </div>

        {/* Description with subtle styling */}
        {description && (
          <div className="flex items-start gap-3">
            <div className="mt-2.5 h-6 w-0.5 rounded-full bg-primary/20" />
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground/80 md:text-base">
              {description}
            </p>
          </div>
        )}
      </div>

      {/* Action with glass effect */}
      {action && (
        <div className="relative flex shrink-0 items-center gap-2 self-start rounded-xl bg-muted/30 px-1 py-1 backdrop-blur-sm transition-all hover:bg-muted/50 md:self-center">
          <div className="absolute inset-0 rounded-xl ring-1 ring-primary/5" />
          {action}
        </div>
      )}
    </div>
  );
}