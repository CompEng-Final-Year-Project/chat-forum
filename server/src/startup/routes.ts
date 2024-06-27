import express, { Application } from "express";
import { error } from "../middleware/error";
import cors, {CorsOptions} from "cors";
import auth from "../routes/auth";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import feed from '../routes/feed'
import chat from '../routes/chat'

export const routes = (app: Application) => {
  const corsOptions: CorsOptions = {
    origin: "http://localhost:5173",
    credentials: true
  }
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use("/api/auth", auth);
  app.use('/api/feed', feed)
  app.use('/api/chats', chat)
  app.use(error);
};