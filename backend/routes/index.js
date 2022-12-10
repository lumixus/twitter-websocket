//Our all routes gonna collect in here.
import express from "express";
import { authRouter } from "./auth";
// export const routes = express.Router();
export const routes = express.Router();;


routes.use("/auth", authRouter);