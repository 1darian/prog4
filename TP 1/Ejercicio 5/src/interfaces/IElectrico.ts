export interface IElectrico {
  cargar(): void;
  descargar(): void;
  estaCargado(): boolean;
  getCarga(): number;
  setCarga(carga: number): void;
}
