import { Router } from "express";
import { check } from "express-validator";

import {

    servicePost,
    serviceGet

} from './service.controller.js'

import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router ();

router.get("/", serviceGet);

router.post(
    "/",
    [
        validarJWT,
        check("services", "El nombre es obligatorio").not().isEmpty(),
        check("description", "La descripcion es obligatorio").not().isEmpty(),

    ],servicePost
)

export default router;
