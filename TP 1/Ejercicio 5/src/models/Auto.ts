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

  public cargarEnergia(cantidad: number): void {
    this.carga += cantidad;
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
    this.carga = carga;
  }

  public acelerar(): void {
    super.acelerar();
    this.cargarEnergia(-1);
  }

  public frenar(): void {
    super.frenar();
    this.cargarEnergia(1);
  }
}
