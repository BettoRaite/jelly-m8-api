import path from "node:path";
import fs from "node:fs/promises";
import type { TypedRequest } from "@/lib/types/types";
import type { Response } from "express";

export const handleGetUserProfileImage = async (
  req: TypedRequest<
    unknown,
    unknown,
    {
      imageName: string;
    }
  >,
  res: Response,
) => {
  const imageName = req.params.imageName as string;
  const imagePath = path.join(`${process.cwd()}/tmp/uploads/`, imageName); // Construct the full path
  console.log(imagePath);
  try {
    await fs.access(imagePath, fs.constants.R_OK);
    res.sendFile(imagePath);
  } catch (err) {
    console.error(err); // Log error for debugging
    return res.status(404).send("Image not found"); // Send 404 response if file not found
  }
};
