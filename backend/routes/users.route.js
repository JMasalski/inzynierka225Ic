import { Router } from 'express';
import {authenticate} from "../middleware/auth.js";
import {requireOnboarding} from "../middleware/requireOnboarding.js";
import {deleteUsers, getAllUsers, getUsersWithoutGroup} from "../controllers/users.controller.js";
import {isTeacherOrRoot} from "../middleware/isTeacherOrRoot.js";

const usersRouter = Router()

usersRouter.get("/", authenticate,requireOnboarding,isTeacherOrRoot,getAllUsers)
usersRouter.get("/without-group", authenticate,requireOnboarding,isTeacherOrRoot,getUsersWithoutGroup)

usersRouter.delete("/delete", authenticate,requireOnboarding,isTeacherOrRoot,deleteUsers)


export default usersRouter;