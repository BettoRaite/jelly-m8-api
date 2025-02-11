import config from "./lib/config/config";
import userService from "./features/users/user.service";
import fs from "node:fs";
import path from "node:path";
import "./seedDB";
import { seedDB } from "./seedDB";

const createAdmin = async () => {
  try {
    const user = await userService.getUserBy({ username: "admin" });
    if (!user) {
      await userService.createUser({
        accessSecret: "admin",
        username: "admin",
        userRole: "admin",
      });
    }
    console.log("Successful init of admin user");
  } catch (err) {
    console.log("Failed to init admin", err);
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

if (config.node_env === "development") {
  (() => {
    createAdmin();
    createUploadFolder();
    seedDB();
  })();
}
