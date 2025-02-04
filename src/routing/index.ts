import { Router } from "express";
import authRouter from "@/features/auth/auth.route";
import usersRouter from "@/features/users/user.routes";
import profilesRouter from "@/features/profiles/profile.routes";
import complimentRoutes from "@/features/profiles/compliments/compliment.routes";
import { handleGetUserProfileImage } from "@/features/uploads/uploads.controller";
// import userProfilesRouter from "./userProfiles.route";
// import complimentsRouter from "./compliments.route";

const router: Router = Router();

router.get("/image/:imageName", handleGetUserProfileImage);
router.use(authRouter);
router.use(usersRouter);
router.use(profilesRouter);
router.use(complimentRoutes);

export default router;
