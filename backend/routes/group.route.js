import Router from "express";
import {
    addStudentToGroup,
    createGroup,
    deleteGroup,
    getAllGroupes,
    getGroup, removeStudentFromGroup, updateGroup
} from "../controllers/group.controller.js";
import {authenticate} from "../middleware/auth.js";
import {requireOnboarding} from "../middleware/requireOnboarding.js";
import {isTeacherOrRoot} from "../middleware/isTeacherOrRoot.js";

const groupRouter = Router();

groupRouter.get("/", authenticate,requireOnboarding,isTeacherOrRoot,getAllGroupes)
groupRouter.get("/:id", authenticate,requireOnboarding,isTeacherOrRoot,getGroup)
groupRouter.post("/create-group",authenticate,requireOnboarding, isTeacherOrRoot,createGroup)
groupRouter.post("/:id/add-students",authenticate,requireOnboarding,isTeacherOrRoot ,addStudentToGroup)
groupRouter.post("/remove-students",authenticate,requireOnboarding ,isTeacherOrRoot,removeStudentFromGroup)

groupRouter.delete("/delete-groupes", authenticate,requireOnboarding,isTeacherOrRoot,deleteGroup)
groupRouter.patch("/:id",authenticate,requireOnboarding,isTeacherOrRoot,updateGroup)


export default groupRouter;