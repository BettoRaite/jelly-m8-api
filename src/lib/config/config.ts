import * as dotenv from "dotenv";
import path from "path";
import z from "zod";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const envSchema = z.object({
  NODE_ENV: z
    .enum(["production", "development", "test"])
    .default("development"),
  PORT: z.string().default("4000"),
  SERVER_URL: z.string(),
  CORS_ORIGIN: z.string().default("*"),
  ACCESS_TOKEN_SECRET: z.string().min(1),
  ACCESS_TOKEN_EXPIRE: z.string().min(1),
  DATABASE_URL: z.string(),
});

const { success, data, error } = envSchema.safeParse(process.env);

if (!success) {
  throw new Error(
    `Environment variable validation error: \n${error.errors
      .map((detail) => `${detail.path} ${detail.message}`)
      .join("\n")}`
  );
}

const config = {
  node_env: data.NODE_ENV,
  server: {
    port: data.PORT,
    url: data.SERVER_URL,
  },
  cors: {
    cors_origin: data.CORS_ORIGIN,
  },
  jwt: {
    access_token: {
      secret: data.ACCESS_TOKEN_SECRET,
      expire: data.ACCESS_TOKEN_EXPIRE,
      cookieName: "token",
    },
  },
  database: {
    url: data.DATABASE_URL,
  },
} as const;
export default config;
