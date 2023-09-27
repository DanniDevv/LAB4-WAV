const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

// Función para calcular los días faltantes entre dos fechas.
function calcularDiasFaltantes(fecha) {
  const fechaActual = new Date();
  const fechaIngresada = new Date(fecha);
  const diferencia = fechaIngresada - fechaActual;
  const diasFaltantes = Math.floor(diferencia / (1000 * 60 * 60 * 24));

  return diasFaltantes;
}

// Función para obtener la hora actual en diferentes formatos.
function obtenerHora() {
  const ahora = new Date();
  const horaActual = ahora.toLocaleTimeString(); // Formato predeterminado
  const hora24 = ahora.toLocaleTimeString('en-US', { hour12: false });
  const hora12 = ahora.toLocaleTimeString('en-US', { hour12: true });

  return {
    horaActual: `Hora Actual (Formato Predeterminado): ${horaActual}`,
    hora24: `Hora 24 Horas: ${hora24}`,
    hora12: `Hora 12 Horas: ${hora12}`,
  };
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/calcular') {
    if (req.method === 'GET') {
      // Mostrar el formulario HTML para ingresar una fecha.
      fs.readFile('formulario.html', 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500);
          return res.end('Error interno del servidor.');
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      });
    } else if (req.method === 'POST') {
      // Procesar el formulario cuando se envía una fecha.
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const fechaIngresada = new URLSearchParams(body).get('fecha');

        if (fechaIngresada) {
          const diasFaltantes = calcularDiasFaltantes(fechaIngresada);
          const mensaje = `Faltan ${diasFaltantes} días para la fecha ${fechaIngresada}`;

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`<h1>${mensaje}</h1>`);
        } else {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Por favor, ingresa una fecha válida en el formulario.');
        }
      });
    }
  } else if (parsedUrl.pathname === '/hora') {
    const horas = obtenerHora();

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <h1>Hora en Distintos Formatos</h1>
      <ul>
        <li>${horas.horaActual}</li>
        <li>${horas.hora24}</li>
        <li>${horas.hora12}</li>
      </ul>
    `);
  } else if (parsedUrl.pathname === '/inicio' || parsedUrl.pathname === '/galeria') {
    const rutaMapeo = {
      '/inicio': 'inicio.html',
      '/galeria': 'galeria.html',
    };

    if (rutaMapeo[parsedUrl.pathname]) {
      const rutaArchivo = path.join(__dirname, rutaMapeo[parsedUrl.pathname]);

      fs.readFile(rutaArchivo, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500);
          return res.end('Error interno del servidor.');
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Página no encontrada');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Página no encontrada');
  }
});

server.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
