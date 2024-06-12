import { Router } from "express";
import { check } from "express-validator";
import { productGet, productPost, productsPut, productDelete } from "./product.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", productGet);

router.post(
    "/",
    [
        validarJWT,
        check("products", "El nombre del producto es obligatorio").not().isEmpty(),
        check("description", "La descripción es obligatoria").not().isEmpty(),
        validarCampos
    ],
    productPost
);

router.put("/:id", [
    validarJWT,
    check("products", "El nombre del producto es obligatorio").not().isEmpty(),
    check("description", "La descripción es obligatoria").not().isEmpty(),
    validarCampos
],
productsPut
);

router.delete("/:id", validarJWT, productDelete);


export default router;
