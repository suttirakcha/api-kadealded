import express from 'express'
import { controllerContactUs } from '../controllers/contactUs.controller.js'

const contactRoute = express.Router()

contactRoute.post('/contactus',controllerContactUs)

export default contactRoute