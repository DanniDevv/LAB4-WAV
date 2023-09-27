function suma(a, b) {
    return a + b;
}

function resta(a, b) {
    return a - b;
}

function multiplicacion(a, b) {
    return a * b;
}

function division(a, b) {
    if (b === 0) {
        return 'Error: División por cero';
    }
    return a / b;
}

module.exports = {
    suma,
    resta,
    multiplicacion,
    division,
};
