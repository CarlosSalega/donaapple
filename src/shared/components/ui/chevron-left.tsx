import type { SVGProps } from "react";

interface ChevronLeftProps extends SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

export function ChevronLeft({
  className = "",
  size = 24,
  ...props
}: ChevronLeftProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
