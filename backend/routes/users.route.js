import { Router } from 'express';
import {authenticate} from "../middleware/auth.js";
import {requireOnboarding} from "../middleware/requireOnboarding.js";
import {deleteUsers, getAllUsers} from "../controllers/users.controller.js";

const usersRouter = Router()

usersRouter.get("/", authenticate,requireOnboarding,getAllUsers)

usersRouter.delete("/delete", authenticate,requireOnboarding,deleteUsers)


export default usersRouter;