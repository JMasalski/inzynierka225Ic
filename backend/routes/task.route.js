import Router from 'express'
import {authenticate} from "../middleware/auth.js";
import {requireOnboarding} from "../middleware/requireOnboarding.js";
import {isTeacherOrRoot} from "../middleware/isTeacherOrRoot.js";
import {createNewTask, getAllTasks, getIndividualTask, getStudentTask} from "../controllers/task.controller.js";

const taskRouter = Router()

taskRouter.post("/",authenticate,requireOnboarding,isTeacherOrRoot,createNewTask)
taskRouter.get("/",authenticate,requireOnboarding,isTeacherOrRoot,getAllTasks)

taskRouter.get("/student-task",authenticate,requireOnboarding,getStudentTask)
taskRouter.get("/:id",authenticate,requireOnboarding,getIndividualTask)


export default taskRouter;