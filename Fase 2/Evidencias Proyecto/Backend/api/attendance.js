import express from 'express'
import db from '../db/db.js'
import { sendSuccess, sendError } from './helpers.js'

const router = express.Router()

router.get('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params
  try {
    const logs = db.prepare(`
      SELECT game_logs.*, users.name as user_name
      FROM game_logs
      JOIN users ON game_logs.user_id = users.id
      WHERE session_id = ?
    `).all(sessionId)
    return sendSuccess(res, logs, 'Asistencia obtenida correctamente')
  } catch (error) {
    return sendError(res, 'Error al obtener asistencia', error.message, 500)
  }
})

router.post('/', (req, res) => {
  const { user_id, session_id, game_id, duration, game_data } = req.body
  if (!user_id || !session_id || !game_id) {
    return sendError(res, 'Faltan datos obligatorios', null, 400)
  }
  try {
    const insert = db.prepare(`
      INSERT INTO game_logs (user_id, session_id, game_id, duration, game_data)
      VALUES (?, ?, ?, ?, ?)
    `)
    const info = insert.run(user_id, session_id, game_id, duration || null, game_data || null)
    return sendSuccess(res, { logId: info.lastInsertRowid }, 'Asistencia registrada correctamente', 201)
  } catch (error) {
    return sendError(res, 'Error al registrar asistencia', error.message, 500)
  }
})

export default router
