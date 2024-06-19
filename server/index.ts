import { connectDB } from "./startup/db";
import { logger } from "./startup/logger";
import { prod } from "./startup/prod";
import { routes } from "./startup/routes";
import express from "express";
import 'dotenv/config'

const app = express();
app.set("view engine", "ejs")

logger
routes(app)
connectDB()
prod(app)

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    logger.info(`Listening on port ${port}...`)
})

export default server