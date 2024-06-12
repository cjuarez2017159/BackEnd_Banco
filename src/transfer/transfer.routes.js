import {Router } from "../service/service.routes";
import { check } from "express-validator";
import { transferPost } from "./transfer.controller";
import { validarJWT } from "../middlewares/validar-jwt";
import { validarCampos } from "../middlewares/validar-campos";

const router = Router();

router.post("/",
    [
        validarJWT,

        validarCampos
    ], transferPost
)

export default router;
