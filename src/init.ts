import config from "./lib/config/config";
import userService from "./features/users/user.service";
import fs from "node:fs";
import path from "node:path";
import "./seedDB";
import { seedDB } from "./seedDB";
import db from "./database";
import { UsersTable } from "./database/schema";
import { eq } from "drizzle-orm";
import type { CreateUserPayload } from "./features/users/user.schema";

const createAdmin = async () => {
  const payload: CreateUserPayload = {
    accessSecret: config.admin_auth_secret,
    username: "admin",
    userRole: "admin",
  };
  try {
    const user = await userService.getUserBy({ username: "admin" });
    // Creating admin if not exists
    if (!user) {
      await userService.createUser(payload);
    } else {
      await db
        .update(UsersTable)
        .set(payload)
        .where(eq(UsersTable.id, user?.id as number));
    }

    console.log(`KEY -> ${config.admin_auth_secret}`);
    console.log("Successful init of admin user");
  } catch (err) {
    console.log("Failed to init admin", err, payload);
  }
};

const createUploadFolder = () => {
  const dirPath = path.join(process.cwd(), "tmp/uploads");
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory '${dirPath}' created.`);
  } else {
    console.log(`Directory '${dirPath}' already exists.`);
  }
};

createAdmin();
createUploadFolder();
seedDB();
