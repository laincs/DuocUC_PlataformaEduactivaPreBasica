import express from 'express'
import authRouter from './api/auth.js'

const app = express()
const PORT = 3000

app.use(express.json())
app.use('/api/auth', authRouter)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
