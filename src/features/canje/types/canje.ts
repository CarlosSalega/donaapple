export interface CanjeFormData {
  modelo: string;
  bateria: number;
  tiempoDeUso: string;
  detalles?: string;
}

export const TIEMPO_DE_USO_OPTIONS = [
  { value: "Menos de 1 año", label: "Menos de 1 año" },
  { value: "1 a 2 años", label: "1 a 2 años" },
  { value: "2 a 3 años", label: "2 a 3 años" },
  { value: "Más de 3 años", label: "Más de 3 años" },
] as const;

export interface CanjeMessageOptions {
  modelo: string;
  bateria: number;
  tiempoDeUso: string;
  detalles?: string;
}