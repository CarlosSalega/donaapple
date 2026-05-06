import { Condition } from "@prisma/client";

export const formatPrice = (price: number | null, currency: string) => {
  if (!price) return "Sin precio";
  return `${currency === "ARS " ? "$ " : "U$D "}${price.toLocaleString()}`;
};

export const getConditionLabel = (condition: Condition) => {
  const labels: Record<Condition, string> = {
    NEW: "Nuevo",
    USED: "Usado",
    REFURBISHED: "Reacondicionado",
  };
  return labels[condition];
};
