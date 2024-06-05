import { Router } from "express";
import { check } from "express-validator";
import {
    favoriteGet,
    favoritePost,
    favoriteGetById,
    favoritePut,
    favoriteDelete
} from "./favorite.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", validarJWT, favoriteGet);

router.post(
    "/",
    [
        validarJWT,
        check("account_number", "El número de cuenta es obligatorio").not().isEmpty(),
        check("alias", "El alias es obligatorio").not().isEmpty(),
        check("DPI", "El DPI es obligatorio").not().isEmpty(),
        validarCampos
    ],
    favoritePost
);

router.get("/:id", validarJWT, favoriteGetById);

router.put(
    "/:id",
    [
        validarJWT,
        check("account_number", "El número de cuenta es obligatorio").not().isEmpty(),
        check("alias", "El alias es obligatorio").not().isEmpty(),
        check("DPI", "El DPI es obligatorio").not().isEmpty(),
        validarCampos
    ],
    favoritePut
);

router.delete("/:id", validarJWT, favoriteDelete);

export default router;
