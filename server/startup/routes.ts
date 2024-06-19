import express, { Application } from "express";
import { error } from "../middleware/error";
import cors from "cors";
import auth from "../routes/auth";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

export const routes = (app: Application) => {
  app.use(express.json());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use("/api/auth", error, auth);
  app.use(error);
};
