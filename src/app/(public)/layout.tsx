import { PublicBanner } from "@/features/home/components/PublicBanner";
import { PublicHeader } from "@/features/home/components/PublicHeader";
import { PublicFooter } from "@/features/home/components/PublicFooter";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicBanner />
      <PublicHeader />
      {children}
      <PublicFooter />
    </>
  );
}