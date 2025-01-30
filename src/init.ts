import config from "./lib/config/config";
import usersService from "./services/users.service";

if (config.node_env === "development") {
  (async () => {
    try {
      const user = await usersService.getUserBy({ username: "admin" });
      if (!user) {
        await usersService.createUser({
          accessSecret: "admin",
          username: "admin",
          userRole: "admin",
        });
      }
      console.log("Successful init of admin user");
    } catch (err) {
      console.log("Failed to init admin", err);
    }
  })();
}
