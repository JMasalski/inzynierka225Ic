import Router from "express";
import {authenticate} from "../middleware/auth.js";
import {authUser, createUser, login, logout} from "../controllers/auth.controller.js";
import {requireOnboarding} from "../middleware/requireOnboarding.js";
import {isTeacherOrRoot} from "../middleware/isTeacherOrRoot.js";

const authRouter = Router();

authRouter.post("/create-user", authenticate,requireOnboarding,isTeacherOrRoot,createUser)
authRouter.post("/login", login)
authRouter.post("/logout", logout )
authRouter.get("/auth-user", authenticate, authUser)

export default authRouter