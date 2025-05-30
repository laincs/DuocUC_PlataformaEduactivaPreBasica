import express from 'express'
import db from '../db/db.js'
import { sendSuccess, sendError } from './helpers.js'

const router = express.Router()

router.get('/', (req, res) => {
  try {
    const grades = db.prepare('SELECT * FROM grades').all()
    return sendSuccess(res, grades, 'Cursos obtenidos correctamente')
  } catch (error) {
    return sendError(res, 'Error al obtener cursos', error.message, 500)
  }
})

export default router
