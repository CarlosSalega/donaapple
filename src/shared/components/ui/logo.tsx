import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-8 w-32">
      <Image
        src="/logo.png"
        alt="logo"
        width={128}
        height={32}
        className="size-full object-contain"
      />
    </div>
  );
}
