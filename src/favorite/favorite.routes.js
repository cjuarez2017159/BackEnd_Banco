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

const router = Router();

router.get("/",  favoriteGet);

router.post(
    "/",
    [
        check("account_number", "El número de cuenta es obligatorio").not().isEmpty(),
        check("alias", "El alias es obligatorio").not().isEmpty(),
        check("DPI", "El DPI es obligatorio").not().isEmpty(),
        validarCampos
    ],
    favoritePost
);

router.get("/:id",  favoriteGetById);

router.put(
    "/:id",
    [
        
        check("account_number", "El número de cuenta es obligatorio").not().isEmpty(),
        check("alias", "El alias es obligatorio").not().isEmpty(),
        check("DPI", "El DPI es obligatorio").not().isEmpty(),
        validarCampos
    ],
    favoritePut
);

router.delete("/:id",  favoriteDelete);

export default router;
