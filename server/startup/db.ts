import mongoose from 'mongoose'
import { logger } from './logger'
import 'dotenv/config'


const mongoDBUri = process.env.MONGODB_URI

if(!mongoDBUri) {
    throw new Error('MONGODB_URI environment variable is not set')
}

export const connectDB = () => {
    mongoose.connect(mongoDBUri).then(() => logger.info(`connected to ${mongoDBUri}...`))
}