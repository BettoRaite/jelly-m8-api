import { v4 as uuidv4 } from "uuid";
import db from "./database";
import { users } from "./database/schema";
import config from "./lib/config/config";
import { getUserByName } from "./database/users.db";

if (config.node_env === "development") {
  const key = uuidv4();
  (async () => {
    try {
      const name = "danya";
      const user = await getUserByName(name);
      if (!user) {
        await db.insert(users).values({
          accessKey: key,
          name,
          role: "admin",
        });
      }

      console.log(
        `Successfully created admin\nAccess key: ${user?.accessKey ?? key}`
      );
    } catch (err) {
      console.log("Failed to create admin", err);
    }
  })();
}
