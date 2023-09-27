const http = require('http');
const fs = require('fs');
const url = require('url');
const procesadorTexto = require('./procesadorTexto');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;

    if (pathName === '/') {
        const query = parsedUrl.query;
        const palabra = query.palabra ? query.palabra.replace(/_/g, ' ') : 'No se proporcionó una palabra';

        const resultado = {
            palabrasDivididas: procesadorTexto.dividirPalabras(palabra),
            cadenaExtraida: procesadorTexto.extraerCadena(palabra, 0, 8),
            textoSinEspacios: procesadorTexto.eliminarEspacios(palabra),
            capitalizado: procesadorTexto.capitalizar(palabra),
            minusculas: procesadorTexto.convertirMinusculas(palabra),
            mayusculas: procesadorTexto.convertirMayusculas(palabra),
            numCaracteres: procesadorTexto.contarCaracteres(palabra)
        };

        fs.readFile('./procesadorTexto.html', (err, html) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }

            const htmlString = html.toString();
            let finalHtml = htmlString;
            Object.keys(resultado).forEach(key => {
                finalHtml = finalHtml.replace(`{${key}}`, resultado[key]);
            });

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(finalHtml);
            res.end();
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

const PORT = 8081;
server.listen(PORT, () => {
    console.log(`Ejecutandose http://localhost:${PORT}/`);
});
