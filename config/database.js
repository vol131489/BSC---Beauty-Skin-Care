const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'beauty_care.db');
const db = new Database(dbPath);

// Inicializar la base de datos con la estructura del archivo SQL
function initializeDatabase() {
  // Crear tabla de usuarios si no existe
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      telefono TEXT,
      password_hash TEXT NOT NULL,
      rol TEXT NOT NULL DEFAULT 'cliente',
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Crear tabla de servicios
  db.exec(`
    CREATE TABLE IF NOT EXISTS servicios (
      id_servicio INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      precio REAL NOT NULL,
      duracion_minutos INTEGER,
      activo INTEGER DEFAULT 1,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Crear tabla de citas
  db.exec(`
    CREATE TABLE IF NOT EXISTS citas (
      id_cita INTEGER PRIMARY KEY AUTOINCREMENT,
      id_usuario INTEGER NOT NULL,
      id_servicio INTEGER NOT NULL,
      fecha_cita DATETIME NOT NULL,
      estado TEXT DEFAULT 'pendiente',
      notas TEXT,
      fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
      FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio)
    )
  `);


  // Crear tabla de reseñas
  db.exec(`
    CREATE TABLE IF NOT EXISTS resenas (
      id_resena INTEGER PRIMARY KEY AUTOINCREMENT,
      id_usuario INTEGER NOT NULL,
      calificacion INTEGER NOT NULL CHECK(calificacion BETWEEN 1 AND 5),
      comentario TEXT NOT NULL,
      estado TEXT DEFAULT 'pendiente',
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    )
  `);

  // Insertar servicios predeterminados si no existen
  const serviceCount = db.prepare('SELECT COUNT(*) as count FROM servicios').get();
  if (serviceCount.count === 0) {
    const insertService = db.prepare(`
      INSERT INTO servicios (nombre, descripcion, precio, duracion_minutos, activo)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertService.run('Tratamientos Faciales', 'Faciales personalizados que hidratan, nutren y restauran la luminosidad natural de tu rostro', 120000, 60, 1);
    insertService.run('Tratamientos Corporales', 'Tratamientos corporales avanzados que sculptan, tonifican y rejuvenecen tu cuerpo', 90000, 45, 1);
    insertService.run('Mascarillas Faciales', 'Mascarillas especializadas con ingredientes premium para diferentes tipos de piel', 80000, 30, 1);
  }

  // Crear usuario admin predeterminado si no existe
  const adminExists = db.prepare('SELECT * FROM usuarios WHERE email = ?').get('admin@beautysite.com');
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare(`
      INSERT INTO usuarios (nombre, apellido, email, telefono, password_hash, rol)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('Samuel', 'Admin', 'admin@beautysite.com', '3000000000', hashedPassword, 'admin');
  }

  console.log('Base de datos inicializada correctamente');
}

// Funciones de usuario
const userQueries = {
  // Buscar usuario por email
  findByEmail: (email) => {
    return db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  },

  // Buscar usuario por ID
  findById: (id) => {
    return db.prepare('SELECT id_usuario, nombre, apellido, email, telefono, rol, fecha_creacion FROM usuarios WHERE id_usuario = ?').get(id);
  },

  // Crear nuevo usuario
  create: (userData) => {
    const hashedPassword = bcrypt.hashSync(userData.password, 10);
    const result = db.prepare(`
      INSERT INTO usuarios (nombre, apellido, email, telefono, password_hash, rol)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userData.nombre, userData.apellido, userData.email, userData.telefono || null, hashedPassword, 'cliente');

    return { id: result.lastInsertRowid, ...userData };
  },

  // Verificar contraseña
  verifyPassword: (plainPassword, hashedPassword) => {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  },

  // Obtener todas las citas de un usuario
  getUserAppointments: (userId) => {
    return db.prepare(`
      SELECT c.*, s.nombre as servicio_nombre, s.precio as servicio_precio
      FROM citas c
      JOIN servicios s ON c.id_servicio = s.id_servicio
      WHERE c.id_usuario = ?
      ORDER BY c.fecha_cita DESC
    `).all(userId);
  }
};

module.exports = {
  db,
  initializeDatabase,
  userQueries
};
