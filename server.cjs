// server.cjs - Versión CommonJS (funciona con require)
// json-server instalado es ESM (package.json type: module). Si require() falla en CJS,
// lo resolvemos con import dinámico dentro de un async IIFE.
const auth = require('json-server-auth');
const cors = require('cors');
const fs = require('fs');

(async () => {
  const jsonServerMod = await import('json-server');
  const jsonServer = jsonServerMod.default ?? jsonServerMod;

  // Leer rules.json
  const rules = JSON.parse(fs.readFileSync('./rules.json', 'utf8'));

  const app = jsonServer.create();
  const router = jsonServer.router('db.json');

  // Asignar la base de datos al app para que auth la use
  app.db = router.db;

  // Middlewares
  app.use(cors());
  app.use(auth.rewriter(rules));
  app.use(auth);
  app.use(router);

  // Iniciar servidor
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`✅ JSON Server Auth corriendo en http://localhost:${PORT}`);
    console.log(`📦 Endpoints disponibles:`);
    console.log(`   - POST /login`);
    console.log(`   - GET /productos (requiere token)`);
    console.log(`   - GET /users (requiere token)`);
  });
})();

