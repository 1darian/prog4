export abstract class Vehiculo {
  protected velocidad: number;
  protected combustible: number;
  protected capacidadCombustible: number;
  protected consumo: number;
  protected marca: string;
  protected modelo: string;

  constructor(
    marca: string,
    modelo: string,
    capacidadCombustible: number,
    consumo: number
  ) {
    this.marca = marca;
    this.modelo = modelo;
    this.capacidadCombustible = capacidadCombustible;
    this.consumo = consumo;
    this.combustible = capacidadCombustible;
    this.velocidad = 0;
  }

  public abstract acelerar(): void;
  public abstract frenar(): void;
}
