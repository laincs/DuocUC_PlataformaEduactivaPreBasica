import express from 'express'
import db from '../db/db.js'
import { sendSuccess, sendError } from './helpers.js'

const router = express.Router()

router.get('/', (req, res) => {
  try {
    const users = db.prepare(`
      SELECT users.id, users.name, email, user_types.name AS user_type, grades.name AS grade, locations.name AS location
      FROM users
      JOIN user_types ON users.user_type_id = user_types.id
      JOIN grades ON users.grade_id = grades.id
      JOIN locations ON users.location_id = locations.id
      WHERE user_types.name = 'student'
    `).all()
    return sendSuccess(res, users, 'Estudiantes obtenidos correctamente')
  } catch (error) {
    return sendError(res, 'Error al obtener estudiantes', error.message, 500)
  }
})

router.get('/:id', (req, res) => {
  try {
    const user = db.prepare(`
      SELECT users.id, users.name, email, user_types.name AS user_type, grades.name AS grade, locations.name AS location
      FROM users
      JOIN user_types ON users.user_type_id = user_types.id
      JOIN grades ON users.grade_id = grades.id
      JOIN locations ON users.location_id = locations.id
      WHERE users.id = ?
    `).get(req.params.id)
    if (!user) return sendError(res, 'Usuario no encontrado', null, 404)
    return sendSuccess(res, user, 'Usuario encontrado')
  } catch (error) {
    return sendError(res, 'Error al obtener usuario', error.message, 500)
  }
})

export default router
