import authRouter from "./auth.route";
import { Router } from "express";
import usersRouter from "./users.route";

const router: Router = Router();

router.use(authRouter);
router.use(usersRouter);

export default router;
