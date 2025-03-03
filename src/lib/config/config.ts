import * as dotenv from "dotenv";
import path from "node:path";
import z from "zod";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["production", "development", "test"])
      .default("development"),
    PORT: z.string().default("4000"),
    SERVER_URL: z.string(),
    CORS_ORIGIN: z.string().default("*"),
    ACCESS_TOKEN_SECRET: z.string().min(1),
    ACCESS_TOKEN_EXPIRE: z.string().min(1),
    DATABASE_URL: z.string(),
    ADMIN_AUTH_SECRET: z.string(),
    SUPABASE_DEFAULT_PROFILE_IMAGE_URL: z.string().optional(),
    SUPABASE_PROJECT_URL: z.string().optional(),
    SUPABASE_API_KEY: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.NODE_ENV === "production") {
        return data.SUPABASE_PROJECT_URL && data.SUPABASE_API_KEY;
      }
      return true;
    },
    {
      message:
        "SUPABASE_PROJECT_URL and SUPABASE_API_KEY are required when NODE_ENV is production",
      path: ["SUPABASE_PROJECT_URL", "SUPABASE_API_KEY"],
    },
  );

const { success, data, error } = envSchema.safeParse(process.env);

if (!success) {
  throw new Error(
    `Environment variable validation error: \n${error.errors
      .map((detail) => `${detail.path} ${detail.message}`)
      .join("\n")}`,
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
  supabase: {
    project_url: data.SUPABASE_PROJECT_URL,
    project_api_key: data.SUPABASE_API_KEY,
    default_profile_image_url: data.SUPABASE_DEFAULT_PROFILE_IMAGE_URL,
  },
  admin_auth_secret: data.ADMIN_AUTH_SECRET,
} as const;
export default config;
