import { Router } from "express";
import authRouter from "@/features/auth/auth.route";
import usersRouter from "@/features/users/user.routes";
import profilesRouter from "@/features/profiles/profile.routes";
import profileComplimentRoutes from "@/features/profiles/compliments/compliment.routes";
import likesRouter from "@/features/compliments/likes/like.routes";
import { createImageHandler } from "@/features/uploads/createImageHandler";
// import userProfilesRouter from "./userProfiles.route";
import complimentsRouter from "@/features/compliments/compliment.route";

const router: Router = Router();

router.get("/image/:imageName", createImageHandler("tmp/uploads"));
router.get("/image/:imageName/local", createImageHandler("public"));
router.use(authRouter);
router.use(usersRouter);
router.use(profilesRouter);
router.use(complimentsRouter);
router.use(likesRouter);
router.use(profileComplimentRoutes);

export default router;
