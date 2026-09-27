const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { initializeDatabase } = require('./config/database');
const authRoutes = require('./routes/auth');
const citasRoutes = require('./routes/citas');
const resenasRoutes = require('./routes/resenas');
const { checkSession } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

initializeDatabase();

// CORS
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://bsc-beautyskincare.com',
    'https://www.bsc-beautyskincare.com',
    'https://bsc-beautyskincare.pages.dev'
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkSession);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/auth', authRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/resenas', resenasRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal. Por favor, inténtalo de nuevo.' });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
