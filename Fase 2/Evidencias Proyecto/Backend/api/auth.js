import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../db/db.js'
import { sendSuccess, sendError } from './helpers.js'

const router = express.Router()
const JWT_SECRET = 'tu_clave_secreta'

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, user_type, grade, location } = req.body
    if (!name || !email || !password || !user_type || !grade || !location) {
      return sendError(res, 'Faltan datos obligatorios', 'Campos incompletos', 400)
    }
    const userTypeRow = db.prepare('SELECT id FROM user_types WHERE name = ?').get(user_type)
    const gradeRow = db.prepare('SELECT id FROM grades WHERE name = ?').get(grade)
    const locationRow = db.prepare('SELECT id FROM locations WHERE name = ?').get(location)
    if (!userTypeRow || !gradeRow || !locationRow) {
      return sendError(res, 'Tipo de usuario, grado o ubicación inválidos', null, 400)
    }
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existingUser) {
      return sendError(res, 'Correo ya registrado', null, 400)
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const insert = db.prepare(`
      INSERT INTO users (name, email, password, user_type_id, grade_id, location_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    const info = insert.run(name, email, hashedPassword, userTypeRow.id, gradeRow.id, locationRow.id)
    return sendSuccess(res, { userId: info.lastInsertRowid }, 'Usuario registrado correctamente', 201)
  } catch (error) {
    console.error(error)
    return sendError(res, 'Error en el servidor', error.message, 500)
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const query = `
      SELECT users.id as userId, users.name, users.password,
             user_types.name as userType,
             grades.name as grade,
             locations.name as location
      FROM users
      JOIN user_types ON users.user_type_id = user_types.id
      JOIN grades ON users.grade_id = grades.id
      JOIN locations ON users.location_id = locations.id
      WHERE users.email = ?
    `
    const user = db.prepare(query).get(email)
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }
    const token = jwt.sign({ id: user.userId, name: user.name }, JWT_SECRET, { expiresIn: '1h' })
    res.json({
      token,
      userId: user.userId,
      name: user.name,
      userType: user.userType,
      grade: user.grade,
      location: user.location
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error en el servidor' })
  }
})

export default router
