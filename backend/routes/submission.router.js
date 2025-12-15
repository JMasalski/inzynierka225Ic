import Router from "express";
import {authenticate} from "../middleware/auth.js";
import {isTeacherOrRoot} from "../middleware/isTeacherOrRoot.js";
import {requireOnboarding} from "../middleware/requireOnboarding.js";
import {getSubmissionsForTask} from "../controllers/submission.controller.js";

const submissionRouter = Router();


submissionRouter.get("/task/:taskId",authenticate,requireOnboarding,isTeacherOrRoot,getSubmissionsForTask);
export default submissionRouter