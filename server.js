// server.js
const express = require('express');
const app = express();
const port = 3000;

// Serve everything inside /public as static files
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Weekly app running at http://localhost:${port}`);
});
