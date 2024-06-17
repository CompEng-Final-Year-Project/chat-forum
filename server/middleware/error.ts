import { ErrorRequestHandler, NextFunction, Request, Response } from "express"
import { logger } from "../startup/logger"

export const error = (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    logger.error(err)
    res.status(500).send("Something failed")
}