import { Vehiculo } from "./Vehiculo";
import { IElectrico } from "../interfaces/IElectrico";

export class Auto extends Vehiculo implements IElectrico {
  private carga: number;

  constructor(
    marca: string,
    modelo: string,
    capacidadCombustible: number,
    consumo: number
  ) {
    super(marca, modelo, capacidadCombustible, consumo);
    this.carga = 100;
  }

  public cargar(): void {
    this.carga = 100;
  }

  public descargar(): void {
    this.carga = 0;
  }

  public estaCargado(): boolean {
    return this.carga > 0;
  }

  public getCarga(): number {
    return this.carga;
  }

  public setCarga(carga: number): void {
    this.carga = Math.max(0, Math.min(100, carga));
  }

  private ajustarCarga(cantidad: number): void {
    this.carga = Math.max(0, Math.min(100, this.carga + cantidad));
  }

  public acelerar(): void {
    this.velocidad += 5;
    this.ajustarCarga(-1);
  }

  public frenar(): void {
    this.velocidad = Math.max(0, this.velocidad - 5);
    this.ajustarCarga(1);
  }
}
