
const { setupAliases } = require('import-aliases');
setupAliases();
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import userRoutes from './routes/userRoutes'
import bookRoutes from './routes/bookRoutes'
import authRoutes from './routes/authRoutes'
import cookieParser from "cookie-parser";
dotenv.config();

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser());
const _dirname = path.resolve()
const port = process.env.PORT || 3000;

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/v1/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}😊😊`)
})

export default app;