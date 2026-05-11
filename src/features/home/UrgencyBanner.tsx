interface UrgencyBannerProps {
  messages: string[];
}

export function UrgencyBanner({ messages }: UrgencyBannerProps) {
  const normalizedMessages = Array.isArray(messages)
    ? messages
    : typeof messages === "string" && messages
      ? JSON.parse(messages)
      : [];

  if (!normalizedMessages || normalizedMessages.length === 0) return null;

  const validMessages = normalizedMessages.filter((m: string) => m && m.trim());

  if (validMessages.length === 0) return null;

  const marqueeItem = validMessages.map((msg: string) => (
    <span key={msg} className="flex items-center">
      <span className="text-warning px-12 text-sm font-medium">
        {msg.trim()}
      </span>
      <span className="text-warning text-sm opacity-50">·</span>
    </span>
  ));

  return (
    <section className="border-border-subtle bg-background sticky top-0 z-50 flex h-10 items-center overflow-hidden border-b">
      <div className="animate-marquee flex shrink-0">
        <div className="flex items-center">{marqueeItem}</div>
        <div className="flex items-center">{marqueeItem}</div>
      </div>
    </section>
  );
}
