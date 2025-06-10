import { Router } from "express";
import {
    githubCallbackHandler,
    accessTokenHandler,
    userHandler,
    getUserReposHandler,
} from "../handlers/auth.js";
import { checkAuth } from "../middlewares/auth.js";

var router = Router();

router.get("/gh-callback", githubCallbackHandler);
router.post("/get-access-token", accessTokenHandler);
router.get("/user", checkAuth, userHandler);
router.get("/repos", checkAuth, getUserReposHandler);

export default router;