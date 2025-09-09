
class Animal {
    hacerSonido(): void {
        console.log("El animal hace un sonido");
    }
}


class Perro extends Animal {
    hacerSonido(): void {
        console.log("El perro ladra");
    }
}

class Gato extends Animal {
    hacerSonido(): void {
        console.log("El gato maúlla");
    }
}


const animales: Animal[] = [new Animal(), new Perro(), new Gato()];

animales.forEach(animal => animal.hacerSonido());