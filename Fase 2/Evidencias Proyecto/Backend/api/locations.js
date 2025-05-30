import express from 'express'
import db from '../db/db.js'
import { sendSuccess, sendError } from './helpers.js'

const router = express.Router()

router.get('/', (req, res) => {
  try {
    const locations = db.prepare('SELECT * FROM locations').all()
    return sendSuccess(res, locations, 'Colegios obtenidos correctamente')
  } catch (error) {
    return sendError(res, 'Error al obtener colegios', error.message, 500)
  }
})

export default router
