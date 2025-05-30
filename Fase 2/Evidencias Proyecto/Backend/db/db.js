import Database from 'better-sqlite3'
import { dirname, join } from 'path'
import { mkdirSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, 'db.sqlite')

if (!existsSync(__dirname)) mkdirSync(__dirname, { recursive: true })

const db = new Database(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS user_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS grades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    user_type_id INTEGER NOT NULL,
    grade_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    FOREIGN KEY (user_type_id) REFERENCES user_types(id),
    FOREIGN KEY (grade_id) REFERENCES grades(id),
    FOREIGN KEY (location_id) REFERENCES locations(id)
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id TEXT NOT NULL,
    grade_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    status TEXT CHECK(status IN ('open', 'closed')) NOT NULL DEFAULT 'open',
    FOREIGN KEY (grade_id) REFERENCES grades(id),
    FOREIGN KEY (location_id) REFERENCES locations(id)
  );

  CREATE TABLE IF NOT EXISTS session_attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_id INTEGER NOT NULL,
    joined_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (session_id) REFERENCES sessions(id),
    UNIQUE(user_id, session_id)
  );

  CREATE TABLE IF NOT EXISTS game_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_id INTEGER NOT NULL,
    game_id TEXT NOT NULL,
    completed_at TEXT NOT NULL DEFAULT (datetime('now')),
    duration INTEGER,
    game_data TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (session_id) REFERENCES sessions(id)
  );

`)

db.exec(`
  INSERT OR IGNORE INTO user_types (name) VALUES ('teacher');
  INSERT OR IGNORE INTO user_types (name) VALUES ('student');

  INSERT OR IGNORE INTO locations (name) VALUES ('school_demo');

  INSERT OR IGNORE INTO grades (name) VALUES ('kinder');

  INSERT OR IGNORE INTO users (id, name, email, password, user_type_id, grade_id, location_id) VALUES
    (1, 'Profesor Demo', 'teacher@example.com', 'hashedpassword1', (SELECT id FROM user_types WHERE name='teacher'), (SELECT id FROM grades WHERE name='kinder'), (SELECT id FROM locations WHERE name='school_demo')),
    (2, 'Alumno 1', 'alumno1@example.com', 'hashedpassword2', (SELECT id FROM user_types WHERE name='student'), (SELECT id FROM grades WHERE name='kinder'), (SELECT id FROM locations WHERE name='school_demo')),
    (3, 'Alumno 2', 'alumno2@example.com', 'hashedpassword3', (SELECT id FROM user_types WHERE name='student'), (SELECT id FROM grades WHERE name='kinder'), (SELECT id FROM locations WHERE name='school_demo')),
    (4, 'Alumno 3', 'alumno3@example.com', 'hashedpassword4', (SELECT id FROM user_types WHERE name='student'), (SELECT id FROM grades WHERE name='kinder'), (SELECT id FROM locations WHERE name='school_demo')),
    (5, 'Alumno 4', 'alumno4@example.com', 'hashedpassword5', (SELECT id FROM user_types WHERE name='student'), (SELECT id FROM grades WHERE name='kinder'), (SELECT id FROM locations WHERE name='school_demo'));

  INSERT OR IGNORE INTO sessions (id, game_id, grade_id, location_id, status) VALUES
    (1, 'game_1', (SELECT id FROM grades WHERE name='kinder'), (SELECT id FROM locations WHERE name='school_demo'), 'closed'),
    (2, 'game_2', (SELECT id FROM grades WHERE name='kinder'), (SELECT id FROM locations WHERE name='school_demo'), 'closed'),
    (3, 'game_3', (SELECT id FROM grades WHERE name='kinder'), (SELECT id FROM locations WHERE name='school_demo'), 'open');


  INSERT OR IGNORE INTO session_attendance (user_id, session_id, joined_at) VALUES
    (2, 1, datetime('now', '-3 days')),
    (3, 1, datetime('now', '-3 days')),
    (4, 2, datetime('now', '-1 days')),
    (2, 3, datetime('now', '-1 hours'));

`)


export default db