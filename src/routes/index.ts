import { Router } from "express";
import authRouter from "./auth.route";
import usersRouter from "./users.route";
import profilesRouter from "./profiles.route";
import complimentsRouter from "./compliments.route";

const router: Router = Router();

router.use(authRouter);
router.use(usersRouter);
router.use(profilesRouter);
router.use(complimentsRouter);

export default router;
