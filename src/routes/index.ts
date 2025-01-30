import { Router } from "express";
import authRouter from "./auth.route";
import usersRouter from "./users.route";
// import userProfilesRouter from "./userProfiles.route";
// import complimentsRouter from "./compliments.route";

const router: Router = Router();

router.use(authRouter);
router.use(usersRouter);
// router.use(userProfilesRouter);
// router.use(complimentsRouter);

export default router;
