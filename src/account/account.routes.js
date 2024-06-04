import { Router } from "express";
import { check } from "express-validator";
import { accountDesactivation, accountGet, accountPost, accountPut } from "./account.controller.js";

const router = Router()

router.get('/',
    [
     
    ], accountGet);

router.post('/',
    [

    ], accountPost
)

router.put("/:id",
    [

    ], accountPut
)

router.delete("/:id",
        [

        ], accountDesactivation
)
export default router;
