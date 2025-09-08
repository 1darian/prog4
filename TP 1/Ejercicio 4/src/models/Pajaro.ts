import { Animal } from "./Animal";
import { Volador } from "../interfaces/IVolador";

export class Pajaro extends Animal implements Volador {
  private especie: string;

  constructor(nombre: string, especie: string) {
    super(nombre);
    this.especie = especie;
  }
  
  public volar(): void {
    console.log(`${this.nombre} está volando.`);
  }

  public hacerSonido(): void {
    console.log(`${this.nombre} dice: Cuac cuac!`);
  }
}
