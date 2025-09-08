import { Vehiculo } from "./Vehiculo";

export class Moto extends Vehiculo {
  private cilindrada: number;

  constructor(
    marca: string,
    modelo: string,
    capacidadCombustible: number,
    consumo: number,
    cilindrada: number
  ) {
    super(marca, modelo, capacidadCombustible, consumo);
    this.cilindrada = cilindrada;
  }

  public acelerar(): void {
    super.acelerar();
  }

  public frenar(): void {
    super.frenar();
  }
}
