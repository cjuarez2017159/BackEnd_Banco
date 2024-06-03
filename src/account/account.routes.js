import { Router } from "express";
import { check } from "express-validator";
import { accountGet, accountPost } from "./account.controller.js";

const router = Router()

router.get('/',
    [
     
    ], accountGet);

router.post('/',
    [

    ], accountPost
)

export default router;
