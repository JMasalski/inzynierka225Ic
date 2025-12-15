import Router from 'express'
import {authenticate} from "../middleware/auth.js";
import {requireOnboarding} from "../middleware/requireOnboarding.js";
import {isTeacherOrRoot} from "../middleware/isTeacherOrRoot.js";
import {
    createNewTask,
    getAllTasks,
    getIndividualTask,
    getStudentTask, runTask,
    submitTask
} from "../controllers/task.controller.js";

const taskRouter = Router()

taskRouter.post("/",authenticate,requireOnboarding,isTeacherOrRoot,createNewTask)
taskRouter.get("/",authenticate,requireOnboarding,isTeacherOrRoot,getAllTasks)

taskRouter.get("/student-task",authenticate,requireOnboarding,getStudentTask)
taskRouter.get("/:id",authenticate,requireOnboarding,getIndividualTask)
taskRouter.post("/run",authenticate,requireOnboarding,runTask)
taskRouter.post("/save-submission",authenticate,requireOnboarding,submitTask)


export default taskRouter;