const frase = "Hola, soy un ejemplo de cadena.";
const posicion = frase.indexOf("ejemplo");

if (posicion !== -1) {
    console.log(`La palabra "ejemplo" comienza en la posición ${posicion}.`);
} else {
    console.log("La palabra no fue encontrada en la cadena.");
}
