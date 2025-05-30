import express from 'express'
import authRouter from './api/auth.js'
import usersRouter from './api/users.js'
import locationsRouter from './api/locations.js'
import gradesRouter from './api/grades.js'
import sessionsRouter from './api/sessions.js'
import attendanceRouter from './api/attendance.js'

const app = express()
app.use(express.json())

app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/locations', locationsRouter)
app.use('/grades', gradesRouter)
app.use('/sessions', sessionsRouter)
app.use('/attendance', attendanceRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`)
})
