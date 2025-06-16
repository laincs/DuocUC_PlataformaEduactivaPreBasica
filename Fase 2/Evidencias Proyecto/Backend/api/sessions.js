import express from 'express'
import db from '../db/db.js'
import { sendSuccess, sendError } from './helpers.js'

const router = express.Router()

router.get('/', (req, res) => {
  const { grade, location } = req.query
  try {
    let sessions
    if (grade && location) {
      sessions = db.prepare(`
        SELECT sessions.*, grades.name AS grade_name, locations.name AS location_name
        FROM sessions
        JOIN grades ON sessions.grade_id = grades.id
        JOIN locations ON sessions.location_id = locations.id
        WHERE grades.name = ? AND locations.name = ?
      `).all(grade, location)
    } else {
      sessions = db.prepare(`
        SELECT sessions.*, grades.name AS grade_name, locations.name AS location_name
        FROM sessions
        JOIN grades ON sessions.grade_id = grades.id
        JOIN locations ON sessions.location_id = locations.id
      `).all()
    }
    return sendSuccess(res, sessions, 'Sesiones obtenidas correctamente')
  } catch (error) {
    return sendError(res, 'Error al obtener sesiones', error.message, 500)
  }
})

router.post('/', (req, res) => {
  const { game_id, grade, location } = req.body
  if (!game_id || !grade || !location) {
    return sendError(res, 'Faltan datos obligatorios', null, 400)
  }
  try {
    const gradeRow = db.prepare('SELECT id FROM grades WHERE name = ?').get(grade)
    const locationRow = db.prepare('SELECT id FROM locations WHERE name = ?').get(location)
    if (!gradeRow || !locationRow) {
      return sendError(res, 'Grado o ubicación inválidos', null, 400)
    }
    const insert = db.prepare(`
      INSERT INTO sessions (game_id, grade_id, location_id)
      VALUES (?, ?, ?)
    `)
    const info = insert.run(game_id, gradeRow.id, locationRow.id)
    return sendSuccess(res, { sessionId: info.lastInsertRowid }, 'Sesión creada correctamente', 201)
  } catch (error) {
    return sendError(res, 'Error al crear sesión', error.message, 500)
  }
})

router.put('/:id/close', (req, res) => {
  const { id } = req.params
  try {
    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(id)
    if (!session) return sendError(res, 'Sesión no encontrada', null, 404)
    const update = db.prepare('UPDATE sessions SET status = ? WHERE id = ?')
    update.run('closed', id)
    return sendSuccess(res, null, 'Sesión cerrada correctamente')
  } catch (error) {
    return sendError(res, 'Error al cerrar sesión', error.message, 500)
  }
})

router.get('/:id', (req, res) => {
  const { id } = req.params
  try {
    const session = db.prepare(`
      SELECT sessions.*, grades.name AS grade_name, locations.name AS location_name
      FROM sessions
      JOIN grades ON sessions.grade_id = grades.id
      JOIN locations ON sessions.location_id = locations.id
      WHERE sessions.id = ?
    `).get(id)
    if (!session) return sendError(res, 'Sesión no encontrada', null, 404)
    return sendSuccess(res, session, 'Sesión encontrada')
  } catch (error) {
    return sendError(res, 'Error al obtener sesión', error.message, 500)
  }
})

router.get('/:id/users', (req, res) => {
  const { id } = req.params

  try {
    const users = db.prepare(`
      SELECT users.id AS user_id, users.name, users.email,
             sa.joined_at, sa.left_at,
             CASE 
               WHEN sa.left_at IS NULL THEN 'active'
               ELSE 'finished'
             END AS status
      FROM session_attendance sa
      JOIN users ON sa.user_id = users.id
      WHERE sa.session_id = ?
    `).all(id)

    return sendSuccess(res, users, 'Usuarios de la sesión obtenidos correctamente')
  } catch (error) {
    return sendError(res, 'Error al obtener usuarios de la sesión', error.message, 500)
  }
})

router.post('/:id/start', (req, res) => {
  const { id } = req.params
  const { user_id } = req.body

  if (!user_id) {
    return sendError(res, 'Falta el ID del usuario', null, 400)
  }

  try {
    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(id)
    if (!session) return sendError(res, 'Sesión no encontrada', null, 404)

    if (session.status === 'closed') {
      return sendError(res, 'No se puede registrar inicio. La sesión está cerrada.', null, 400)
    }

    const existing = db.prepare(`
      SELECT * FROM session_attendance
      WHERE session_id = ? AND user_id = ?
    `).get(id, user_id)

    if (!existing) {
      db.prepare(`
        INSERT INTO session_attendance (session_id, user_id, joined_at)
        VALUES (?, ?, datetime('now'))
      `).run(id, user_id)
    } else {
      return sendError(res, 'El usuario ya está registrado en esta sesión', null, 400)
    }

    return sendSuccess(res, null, 'Inicio de sesión registrado')
  } catch (error) {
    return sendError(res, 'Error al registrar inicio de sesión', error.message, 500)
  }
})

router.get('/:id/status', (req, res) => {
  const { id } = req.params;
  try {
    const session = db.prepare('SELECT status FROM sessions WHERE id = ?').get(id);
    if (!session) return sendError(res, 'Sesión no encontrada', null, 404);

    return sendSuccess(res, { status: session.status }, 'Estado de la sesión obtenido');
  } catch (error) {
    return sendError(res, 'Error al obtener estado de sesión', error.message, 500);
  }
});



router.post('/:id/end', (req, res) => {
  const { id } = req.params
  const { user_id } = req.body

  if (!user_id) {
    return sendError(res, 'Falta el ID del usuario', null, 400)
  }

  try {
    const attendance = db.prepare(`
      SELECT * FROM session_attendance
      WHERE session_id = ? AND user_id = ?
    `).get(id, user_id)

    /* if (!attendance) {
      return sendError(res, 'No se encontró una asistencia para esta sesión y usuario', null, 404)
    } */

    db.prepare(`
      UPDATE session_attendance
      SET left_at = datetime('now')
      WHERE session_id = ? AND user_id = ?
    `).run(id, user_id)

    return sendSuccess(res, null, 'Término de sesión registrado')
  } catch (error) {
    return sendError(res, 'Error al registrar término de sesión', error.message, 500)
  }
})


export default router
