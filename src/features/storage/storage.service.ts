import { createClient } from "@supabase/supabase-js";
import config from "@/lib/config/config";
import logger from "@/middleware/logger";
import fs from "node:fs/promises";
// Create Supabase client

let supabase = {} as ReturnType<typeof createClient>;
if (config.node_env === "production") {
  supabase = createClient(
    config.supabase.project_url,
    config.supabase.project_api_key,
  );
  if (!supabase) {
    throw new TypeError("Supabase client init failed");
  }
}
/**
 * Uploads a file to Supabase storage.
 * @param filepath - The path where the file will be stored.
 * @param file - The file to upload.
 * @param contentType - The MIME type of the file.
 * @throws {Error} If the upload fails.
 */
const uploadFileToSupabase = async (
  filepath: string,
  file: File,
  contentType: string,
) => {
  const { error } = await supabase.storage
    .from("images")
    .upload(filepath, file, { contentType, upsert: true });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Creates a signed URL for a file in Supabase storage.
 * @param filepath - The path of the file in storage.
 * @param expiresIn - The expiration time for the URL in seconds.
 * @returns The signed URL.
 * @throws {Error} If the URL creation fails.
 */
const createSignedUrl = async (filepath: string, expiresIn: number) => {
  const { data, error } = await supabase.storage
    .from("images")
    .createSignedUrl(filepath, expiresIn);

  if (error) {
    throw new Error(`Failed to create signed URL: ${error.message}`);
  }

  return data.signedUrl;
};

/**
 * Validates the file extension and MIME type.
 * @param filename - The name of the file.
 * @param mimeType - The MIME type of the file.
 * @throws {Error} If the file is invalid.
 */
const validateFile = (filename: string, mimeType: string) => {
  const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

  const extension = filename.split(".").pop()?.toLowerCase();
  if (!extension || !allowedExtensions.includes(extension)) {
    throw new Error(`Invalid file extension: ${extension}`);
  }

  if (!allowedMimeTypes.includes(mimeType)) {
    throw new Error(`Invalid MIME type: ${mimeType}`);
  }
};

export const tryUploadUserProfileImage = async (
  userId: number,
  profileImage?: Express.Multer.File,
): Promise<string> => {
  try {
    if (!profileImage) {
      throw new Error("No profile image provided");
    }

    // Validate the file
    validateFile(profileImage.originalname, profileImage.mimetype);

    // Generate file path
    const fileName = `profile.${profileImage.originalname.split(".").pop()}`;
    const filepath = `public/${userId}/${fileName}`;

    // Read the file and create a File object
    const imageBuffer = await fs.readFile(profileImage.path);
    const file = new File([imageBuffer], fileName, {
      type: profileImage.mimetype,
    });

    // Upload the file to Supabase
    await uploadFileToSupabase(filepath, file, profileImage.mimetype);

    // Create a signed URL for the uploaded file
    const signedUrl = await createSignedUrl(filepath, 60 * 60 * 60); // 60 hours expiration

    return signedUrl;
  } catch (err) {
    logger.error(`Error uploading profile image: ${err.message}`);
    return config.supabase.default_profile_image_url as string;
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
