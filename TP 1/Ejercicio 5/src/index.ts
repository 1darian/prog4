import { Auto, Moto } from "./models";

const miMoto = new Moto("Yamaha", "La primera", 14, 4.5, 689);
console.log("Moto creada:", miMoto.toString());

miMoto.acelerar();
console.log("Moto acelerada:", miMoto.toString());

miMoto.frenar();
console.log("Moto frenada:", miMoto.toString());

const miAuto = new Auto("Tesla", "Model S", 75, 15);
console.log("Auto creado:", miAuto.toString());

miAuto.acelerar();
console.log("Auto acelerado:", miAuto.toString());
console.log("Carga despues de acelerar:", miAuto.getCarga());

miAuto.frenar();
console.log("Auto frenado:", miAuto.toString());
console.log("Carga despues de frenar:", miAuto.getCarga());

miAuto.descargar();
console.log("Auto descargado:", miAuto.toString());
console.log("El auto esta cargado?", miAuto.estaCargado());

miAuto.cargar();
console.log("Auto cargado:", miAuto.toString());
console.log("El auto esta cargado?", miAuto.estaCargado());

miAuto.setCarga(50);
console.log("Carga seteada a 50:", miAuto.getCarga());

console.log("Estado final del auto:", miAuto.toString());