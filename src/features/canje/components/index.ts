export { PlanCanje } from "./PlanCanje";

export interface CanjeFormData {
  modelo: string;
  bateria: number;
  tiempoDeUso: string;
  detalles?: string;
}

export interface CanjeMessageOptions {
  modelo: string;
  bateria: number;
  tiempoDeUso: string;
  detalles?: string;
}