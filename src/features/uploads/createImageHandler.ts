import path from "node:path";
import fs from "node:fs/promises";
import type { TypedRequest } from "@/lib/types/types";
import type { Response } from "express";

export const createImageHandler =
  (searchPath: string) =>
  async (
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
    const imagePath = path.join(`${process.cwd()}/${searchPath}/`, imageName); // Construct the full path
    try {
      await fs.access(imagePath, fs.constants.R_OK);
      res.sendFile(imagePath);
    } catch (err) {
      return res.status(404).send("Image not found"); // Send 404 response if file not found
    }
  };
