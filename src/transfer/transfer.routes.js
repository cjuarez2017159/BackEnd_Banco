import { Router } from 'express';
import { check } from 'express-validator';
import { cancelTransfer, transferPost } from './transfer.controller.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarLimiteDiarioTransferencia } from '../middlewares/validaciones.js';

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check("amount", "The amount is required").not().isEmpty(),
        check("account_number", "The account_number is required").not().isEmpty(),
        check("DPI", "The DPI is required").not().isEmpty(),
        validarCampos,
        validarLimiteDiarioTransferencia
    ],
    transferPost
);

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "The id is required").not().isEmpty(),
        check("id", "The id is not a valid MongoID").isMongoId(),
        validarCampos
    ],
    cancelTransfer
);

export default router;