import { Header } from "@/features/home/Header";

interface PublicHeaderProps {
  bannerEnabled?: boolean;
}

export function PublicHeader({ bannerEnabled = false }: PublicHeaderProps) {
  return <Header bannerEnabled={bannerEnabled} />;
}