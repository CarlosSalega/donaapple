import { PublicBanner } from "@/features/home/components/PublicBanner";
import { PublicHeader } from "@/features/home/components/PublicHeader";
import { PublicFooter } from "@/features/home/components/PublicFooter";
import { getSiteConfig } from "@/server/actions/config/siteConfig";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getSiteConfig();
  const bannerEnabled = config.bannerEnabled ?? false;

  return (
    <>
      <PublicBanner />
      <PublicHeader bannerEnabled={bannerEnabled} />
      {children}
      <PublicFooter />
    </>
  );
}