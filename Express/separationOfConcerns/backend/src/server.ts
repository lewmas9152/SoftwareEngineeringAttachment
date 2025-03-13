import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import userRoutes from './routes/userRoutes'
import bookRoutes from './routes/bookRoutes'

dotenv.config();

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const _dirname = path.resolve()
const port = process.env.PORT || 3000;

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/books', bookRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}😊😊`)
})

export default app;