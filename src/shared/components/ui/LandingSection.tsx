import { cn } from "@/shared/lib/utils";

interface LandingSectionProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
}

export function LandingSection({
  children,
  className,
  innerClassName,
  id,
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "bg-surface overflow-hidden px-4 py-8 md:px-16 md:py-12 lg:px-24 lg:py-16",
        className,
      )}
    >
      <div className={cn("mx-auto max-w-7xl", innerClassName)}>{children}</div>
    </section>
  );
}
