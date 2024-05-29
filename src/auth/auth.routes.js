import { Router } from "express";
import { check } from "express-validator"
import { login } from "./auth.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router()

router.post('/login',
    [
        check('account_number', 'El número de cuenta es obligatorio').not().isEmpty(),
        check('username', 'El username es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('password', 'El password debe de ser mayor a 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ], login);

export default router;
