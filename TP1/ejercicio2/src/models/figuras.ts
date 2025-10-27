
abstract class Figura {
    abstract calcularArea(): number;
}


class Cuadrado extends Figura {
    constructor(private lado: number) {
        super();
    }

    calcularArea(): number {
        return this.lado * this.lado;
    }
}


class Rectangulo extends Figura {
    constructor(private base: number, private altura: number) {
        super();
    }

    calcularArea(): number {
        return this.base * this.altura;
    }
}


class Circulo extends Figura {
    constructor(private radio: number) {
        super();
    }

    calcularArea(): number {
        return Math.PI * this.radio * this.radio;
    }
}


const figuras: Figura[] = [
    new Cuadrado(4),
    new Rectangulo(5, 10),
    new Circulo(3)
];

figuras.forEach((figura, i) => {
    console.log(`Área de la figura ${i + 1}: ${figura.calcularArea()}`);
});
