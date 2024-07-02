import { Router } from "express";
import { check } from "express-validator";
import { accountDesactivation, accountGet, accountPost, accountPut, getByAccountNumber } from "./account.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarAccountNumberExistente, validarDPIExistente, validarNameClientExistente } from "../middlewares/validaciones.js";

const router = Router()

router.get('/',
    [
     validarJWT
    ], accountGet);

router.post('/',
    [
        validarJWT,
        check("accountNumber", "The account need one account number").not().isEmpty(),
        check("amountAccount", "The account need one amount").not().isEmpty(),
        check("DPI", "The account need one DPI").not().isEmpty(),
        check("nameClient", "The account need one name client").not().isEmpty(),
        validarDPIExistente,
        validarNameClientExistente,
        validarAccountNumberExistente,
        validarCampos
    ], accountPost
)

router.put("/:id",
    [
        validarJWT,
        check("id", "It is not a mongo id").isMongoId(),
        validarCampos
    ], accountPut
)

router.delete("/:id",
        [ 
            validarJWT,
            check("id", "It is not a mongo id").isMongoId()
        ], accountDesactivation
)

router.get("/searching",
        [
            check("accountNumber")("Required account number for the searching").isEmpty().not(),
            validarJWT
        ], getByAccountNumber
)
export default router;
