const express = require('express');

const app = express();
const PORT = process.env.PORT || 5500;
const root = __dirname;

app.use(express.static(root));

const server = app.listen(PORT, () => {
  console.log(`Portfolio listening on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the other process or run:`);
    console.error(`  $env:PORT=5501; npm start`);
    process.exit(1);
  }
  throw err;
});
