export abstract class Animal {
  protected nombre: string;
  
  constructor(nombre: string) {
    this.nombre = nombre;
  }

  public hacerSonido(): void {}
}
