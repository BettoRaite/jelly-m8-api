import type { CreateUserPayload } from "../users/user.schema";
import { createClient } from "@supabase/supabase-js";
import config from "@/lib/config/config";
import logger from "@/middleware/logger";
import fs from "node:fs/promises";
import type { CreateUserProfilePayload } from "../profiles/profile.schema";
// Create Supabase client

const supabase = (() => {
  if (config.node_env !== "development") {
    createClient(config.supabase.project_url, config.supabase.project_api_key);
  }
  return {};
})();

// Return default profile image url in case no image was uploaded
export const tryUploadUserProfileImage = async (
  user: CreateUserPayload,
  profileImage?: Express.Multer.File,
) => {
  try {
    if (!profileImage) {
      throw Error("No profile image");
    }

    const fileName = `profile.${profileImage.originalname.split(".").at(-1)}`;
    const filepath = `public/${user.name}/${fileName}`;

    const image = await fs.readFile(profileImage.path);
    const file = new File([image], fileName);

    // First try to upload file to supabase
    const { error: fileUploadError } = await supabase.storage
      .from("images")
      .upload(filepath, file, {
        contentType: profileImage.mimetype!,
        upsert: true,
      });
    if (fileUploadError) {
      throw fileUploadError;
    }

    // Next we create a downlodable url to that file
    const { data, error: fileUrlCreationError } = await supabase.storage
      .from("images")
      .createSignedUrl(filepath, 60 * 60 * 60);

    if (fileUrlCreationError) {
      throw fileUrlCreationError;
    }
    return data.signedUrl;
  } catch (err) {
    logger.error(err);
    return config.supabase.default_profile_image_url!;
  }
};

export const tryUploadProfileImage = async (
  profile: CreateUserProfilePayload,
  profileImage?: Express.Multer.File,
) => {
  try {
    if (!profileImage) {
      throw Error("No profile image");
    }

    const fileName = `profile.${profileImage.originalname.split(".").at(-1)}`;
    const filepath = `public/${profile.name}/${fileName}`;

    const image = await fs.readFile(profileImage.path);
    const file = new File([image], fileName);

    // First try to upload file to supabase
    const { error: fileUploadError } = await supabase.storage
      .from("images")
      .upload(filepath, file, {
        contentType: profileImage.mimetype as string,
        upsert: true,
      });
    if (fileUploadError) {
      throw fileUploadError;
    }

    // Next we create a downlodable url to that file
    const { data, error: fileUrlCreationError } = await supabase.storage
      .from("images")
      .createSignedUrl(filepath, 60 * 60 * 60);

    if (fileUrlCreationError) {
      throw fileUrlCreationError;
    }
    return data.signedUrl;
  } catch (err) {
    logger.error(err);
    return config.supabase.default_profile_image_url ?? "";
  }
};

export const createLinkToLocalImageFile = (
  imageName: string,
  { isLocal = false } = {},
) => {
  return `${config.server.url}/api/v1/image/${imageName}${isLocal ? "/local" : ""}`;
};

const storageService = {
  createLinkToLocalImageFile,
};

export default storageService;
