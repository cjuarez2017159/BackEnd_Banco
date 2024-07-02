import { Router } from "express";
import { check } from "express-validator";
import {

    clientePost,
    clientesPut,
    clienteGet,
    getClienteById
    

} from "./cliente.controller.js";

import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router ();

router.get("/", clienteGet);

router.post(
    "/",
    [
        validarJWT,
        check("nameClient", "El nombre es obligatorio").not().isEmpty(),
        check("DPI", "El DPI debe ser de 13 dígitos").isLength({ min: 13 }),
        check("address", "La dirección es obligatoria").not().isEmpty(),
        check("cellphone", "El número de teléfono es obligatorio").not().isEmpty(),
        check("email", "El email no es válido").isEmail(),
        check("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
        check("job", "El trabajo es obligatorio").not().isEmpty(),
        check("monthlyIncome", "El ingreso mensual es obligatorio").not().isEmpty(),
        validarCampos
    ],clientePost
)

router.put(
    "/:id",
        [

            validarJWT,
            check("id", "no es un id valido").isMongoId(),
            check("id").custom(getClienteById)

        ],clientesPut

)

export default router;
