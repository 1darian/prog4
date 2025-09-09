export interface IElectrico {
  getCarga(): number;
  setCarga(carga: number): void;
  estaCargado(): boolean;
  cargar(): void; // carga completa
  descargar(): void; // vacia
}
