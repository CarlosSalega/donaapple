import { cn } from "@/shared/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizes = {
  sm: "max-w-3xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  full: "max-w-full",
};

export function Container({
  children,
  className,
  size = "xl",
}: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-4", sizes[size], className)}>
      {children}
    </div>
  );
}
