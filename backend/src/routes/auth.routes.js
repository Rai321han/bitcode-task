import express from "express";
import { login, refresh, register } from "../controllers/auth.controller";
import {
  loginValidators,
  registerValidators,
} from "../validators/auth.validator";
import { validate } from "../middlewares/validate";
const router = express.Router();

router.post("/login", loginValidators, validate, login);
router.post("/register", registerValidators, validate, register);
router.post("/refresh", refresh);

export default router;
