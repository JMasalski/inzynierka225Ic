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

const groupRouter = Router();

groupRouter.get("/", authenticate,requireOnboarding,getAllGroupes)
groupRouter.get("/:id", authenticate,requireOnboarding,getGroup)
groupRouter.post("/create-group",authenticate,requireOnboarding ,createGroup)
groupRouter.post("/:id/add-students",authenticate,requireOnboarding ,addStudentToGroup)
groupRouter.post("/remove-students",authenticate,requireOnboarding ,removeStudentFromGroup)

groupRouter.delete("/delete-groupes", authenticate,requireOnboarding,deleteGroup)
groupRouter.patch("/:id",authenticate,requireOnboarding,updateGroup)


export default groupRouter;