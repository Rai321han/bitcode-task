import express from "express";
import {
  login,
  logout,
  refresh,
  register,
} from "../controllers/auth.controller.js";
import {
  loginValidators,
  registerValidators,
} from "../validators/auth.validator.js";
import { validate } from "../middlewares/validate.js";
const router = express.Router();

router.post("/login", loginValidators, validate, login);
router.post("/register", registerValidators, validate, register);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
