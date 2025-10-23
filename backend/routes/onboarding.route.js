import {Router} from 'express';
import {authenticate} from "../middleware/auth.js";
import {completeOnboarding} from "../controllers/onboarding.controllers.js";

const onboardingRouter = Router()

onboardingRouter.patch("/complete-onboarding", authenticate,completeOnboarding)

export default onboardingRouter;