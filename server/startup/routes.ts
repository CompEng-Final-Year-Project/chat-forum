import express, { Application } from 'express'
import { error } from '../middleware/error'
import hello from '../routes/hello'
import cors from 'cors'

export const routes = (app: Application) => {
    app.use(express.json())
    app.use(cors())
    app.use("/hello", hello)
    app.use(error)
}
