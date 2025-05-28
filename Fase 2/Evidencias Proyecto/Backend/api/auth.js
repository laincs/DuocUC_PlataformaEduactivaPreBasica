import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../db/db.js'

const router = express.Router()
const JWT_SECRET = 'tu_clave_secreta' 

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const result = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hashedPassword)

    res.json({ id: result.lastInsertRowid })
  } catch (err) {
    console.error('Error en registro:', err) // Aquí ves el error completo en consola
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Correo ya registrado' })
    } else {
      res.status(500).json({ error: 'Error en la base de datos' })
    }
  }
})



router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)

  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' })

  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(401).json({ error: 'Credenciales inválidas' })

  const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '1h' })

  res.json({ token })
})

router.get('/users', (req, res) => {
  try {
    const users = db.prepare('SELECT * FROM users').all()
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los usuarios' })
  }
})


export default router
