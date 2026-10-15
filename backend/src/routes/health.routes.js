import { healthCheckController } from "../controllers/health_check_controller.js";
import express from "express";

const route = express.Router()

route.get("/database" , healthCheckController);

export default route ;