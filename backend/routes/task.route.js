import Router from 'express'
import {authenticate} from "../middleware/auth.js";
import {requireOnboarding} from "../middleware/requireOnboarding.js";
import {isTeacherOrRoot} from "../middleware/isTeacherOrRoot.js";
import {createNewTask, getAllTasks} from "../controllers/task.controller.js";

const taskRouter = Router()

taskRouter.post("/",authenticate,requireOnboarding,isTeacherOrRoot,createNewTask)
taskRouter.get("/",authenticate,requireOnboarding,isTeacherOrRoot,getAllTasks)


export default taskRouter;