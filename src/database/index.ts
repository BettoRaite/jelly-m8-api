import { drizzle } from "drizzle-orm/postgres-js";
import config from "@/lib/config/config";

const db = drizzle({
  connection: {
    url: config.database.url,
  },
  casing: "snake_case",
});

export default db;
