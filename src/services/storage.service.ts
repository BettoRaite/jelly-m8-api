import { CreateUserPayload } from "@/schemas/users.schema";
import { createClient } from "@supabase/supabase-js";
import config from "@/lib/config/config";
import logger from "@/middleware/logger";
import fs from "node:fs/promises";
// Create Supabase client
const supabase = createClient(
  config.supabase.project_url,
  config.supabase.project_api_key
);

// Return default profile image url in case no image was uploaded
export const tryUploadUserProfileImage = async (
  profileImage: Express.Multer.File,
  user: CreateUserPayload
) => {
  const image = await fs.readFile(profileImage.path);
  const fileName = `profile.${profileImage.originalname.split(".").at(-1)}`;
  const file = new File([image], fileName);
  const { data, error } = await supabase.storage
    .from("images")
    .upload(`public/${user.name}/${fileName}`, file, {
      contentType: profileImage.mimetype!,
      upsert: true,
    });

  if (error) {
    logger.error("Failed to upload profile image", error);
    return;
  }
  return data.fullPath;
};
