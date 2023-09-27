const http = require('http');
const fs = require('fs');
const url = require('url');
const { suma, resta, multiplicacion, division } = require('./calculadora');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;

    if (pathName === '/') {
        const query = parsedUrl.query;
        const operacion = query.operacion;
        const num1 = parseFloat(query.num1);
        const num2 = parseFloat(query.num2);
        let resultado;

        switch (operacion) {
            case 'suma':
                resultado = suma(num1, num2);
                break;
            case 'resta':
                resultado = resta(num1, num2);
                break;
            case 'multiplicacion':
                resultado = multiplicacion(num1, num2);
                break;
            case 'division':
                resultado = division(num1, num2);
                break;
            default:
                resultado = 'Operación no válida';
        }

        fs.readFile('./calculadora.html', (err, html) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }

            const htmlString = html.toString();
            const finalHtml = htmlString.replace('{resultado}', `Resultado de la ${operacion}: ${resultado}`);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(finalHtml);
            res.end();
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Ejecutandose http://localhost:${PORT}/`);
});
