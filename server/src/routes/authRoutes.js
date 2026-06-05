import { Router } from "express";
import validate from "../middleware/validate.js";
import { loginSchema, logoutSchema, refreshTokenSchema, registerSchema } from "../validator/schema.js";
import { login, logout, register, refreshToken, getUserById } from "../controller/userController.js";

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/register', validate(registerSchema), register);
router.put('/refresh-token', validate(refreshTokenSchema), refreshToken);
router.delete('/logout', validate(logoutSchema), logout);

router.get('/:id', getUserById);

export default router;

