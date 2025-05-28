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
`)

db.exec(`
  INSERT OR IGNORE INTO user_types (name) VALUES ('teacher');
  INSERT OR IGNORE INTO user_types (name) VALUES ('student');
  INSERT OR IGNORE INTO locations (name) VALUES ('school_demo');
  INSERT OR IGNORE INTO grades (name) VALUES ('kinder');
`)

export default db