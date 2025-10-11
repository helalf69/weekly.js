/*  ************************* OLD server.js *****************
// server.js
const express = require('express');
const app = express();
const port = 3000;

// Serve everything inside /public as static files
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Weekly app running at http://localhost:${port}`);
});
*/

// server.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 3000;
const { init, run, get } = require('./priv/db.js');

// Middleware: for å tolke data fra forms (POST)
app.use(express.urlencoded({ extended: true }));

// Session-oppsett
app.use(session({
  secret: 'weekly-secret-key',  // bytt til noe eget
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 time
}));

// Serve statiske filer
app.use(express.static('public'));

// Enkel test på session
app.post('/login', (req, res) => {
  const username = req.body.username;
  if (username && username.trim() !== '') {
    req.session.username = username;
  }
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// API-endepunkt som sender username til frontend
app.get('/api/user', (req, res) => {
  res.json({ username: req.session.username || null });
});

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).send('Mangler brukernavn eller passord');

    const exists = await get('SELECT IDuser FROM Users WHERE Uname = ?', [username]);
    if (exists)
      return res.status(409).send('Brukernavn finnes allerede');

    const hash = await bcrypt.hash(password, 12);
    const result = await run(
      'INSERT INTO Users (Uname, Upassword) VALUES (?, ?)',
      [username, hash]
    );

    res.send(`Bruker registrert med ID ${result.lastID}`);
  } catch (err) {
    console.error('Register-feil:', err);
    res.status(500).send('Feil ved registrering');
  }
});
/*
(Valgfritt) test-innlogging:
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const row = await get('SELECT * FROM Users WHERE Uname = ?', [username]);
    if (!row) return res.status(401).send('Feil brukernavn/passord');

    const ok = await bcrypt.compare(password, row.Upassword);
    if (!ok) return res.status(401).send('Feil brukernavn/passord');

    res.send(`Logget inn som ${row.Uname}`);
  } catch (err) {
    console.error('Login-feil:', err);
    res.status(500).send('Feil ved innlogging');
  }
});
*/

app.listen(port, () => {
  console.log(`Weekly app running at http://localhost:${port}`);
});

(async () => {
  await init();
})();
