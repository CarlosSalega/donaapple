import { getSiteConfig } from "@/server/actions/config/siteConfig";
import { Footer } from "@/features/home/Footer";

export async function PublicFooter() {
  const config = await getSiteConfig();

  const whatsappUrl = config.storeWhatsapp
    ? `https://wa.me/${config.storeWhatsapp.replace(/\D/g, "")}`
    : undefined;

  return (
    <Footer
      brand={config.footerBrand}
      text={config.footerText}
      instagramUrl={config.storeInstagram}
      whatsappUrl={whatsappUrl}
    />
  );
}