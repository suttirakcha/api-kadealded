import express from 'express'
import { getAll } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get('/deal',getAll)

export default userRouter