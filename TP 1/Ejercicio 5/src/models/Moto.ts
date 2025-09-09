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
    if (this.combustible > 0) {
      this.velocidad += 10;
      this.combustible = Math.max(0, this.combustible - this.consumo);
    } else {
      console.log("No hay combustible suficiente");
    }
  }

  public frenar(): void {
    this.velocidad = Math.max(0, this.velocidad - 5);
  }
}
