import { Router } from "express";
import { check } from "express-validator";
import { depositPost, revertDeposits } from "./deposit.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js"
import { validarJWT } from "../middlewares/validar-jwt.js";
import { clienteGet } from "../cliente/cliente.controller.js";

const router = Router();

router.get("/", clienteGet)

router.post(
    "/",
    [
        validarJWT,
        check("amount", "El monto es obligatorio").not().isEmpty(),
        check("account_number", "El account number es obligatorio").not().isEmpty(),
        check("DPI", "El DPI debe ser obligatorio").isLength({min: 13}),
        validarCampos
    ],depositPost
);

router.delete(
    "/:id",
    [
        validarJWT,
        check("amount", "El monto es obligatorio").not().isEmpty(),
        check("account_number", "El account number es obligatorio").not().isEmpty(),
        check("DPI", "El DPI debe ser obligatorio").isLength({min: 13}),
        validarCampos
    ],revertDeposits
)

export default router;