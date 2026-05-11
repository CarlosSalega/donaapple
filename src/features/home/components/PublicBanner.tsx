import { getSiteConfig } from "@/server/actions/config/siteConfig";
import { UrgencyBanner } from "@/features/home/UrgencyBanner";

export async function PublicBanner() {
  const config = await getSiteConfig();

  if (!config.bannerEnabled) return null;

  return <UrgencyBanner messages={config.bannerMessages || []} />;
}