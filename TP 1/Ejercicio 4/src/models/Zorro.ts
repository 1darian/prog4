import { Animal } from "./Animal";

export class Zorro extends Animal {
  public constructor(nombre: string) {
    super(nombre);
  }

  public hacerSonido(): void {
    console.log(`${this.nombre} dice: Pio Pio!`);
  }
}
