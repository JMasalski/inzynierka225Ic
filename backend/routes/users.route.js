import { Router } from 'express';
import {authenticate} from "../middleware/auth.js";
import {requireOnboarding} from "../middleware/requireOnboarding.js";
import {deleteUsers, getAllUsers, getUsersWithoutGroup} from "../controllers/users.controller.js";

const usersRouter = Router()

usersRouter.get("/", authenticate,requireOnboarding,getAllUsers)
usersRouter.get("/without-group", authenticate,requireOnboarding,getUsersWithoutGroup)

usersRouter.delete("/delete", authenticate,requireOnboarding,deleteUsers)


export default usersRouter;