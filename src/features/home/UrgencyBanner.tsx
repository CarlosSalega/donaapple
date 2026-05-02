interface UrgencyBannerProps {
  message: string;
  emoji?: string;
}

export function UrgencyBanner({ message, emoji = "🔥" }: UrgencyBannerProps) {
  return (
    <section className="border-border-subtle bg-background sticky top-0 z-50 flex h-10 items-center overflow-hidden border-b">
      <div className="animate-marquee whitespace-nowrap">
        <span className="text-warning mx-8 text-sm font-medium">
          * {emoji} {message} * {emoji} {message} * {emoji} {message} * {emoji}{" "}
          {message} * {emoji} {message}
        </span>
      </div>
    </section>
  );
}
