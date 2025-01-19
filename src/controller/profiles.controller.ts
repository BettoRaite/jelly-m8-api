import db from "@/database";
import { profiles } from "@/database/schema";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { getProfileById, getProfileByName } from "@/database/profiles.db";
import { CreateProfilePayload } from "@/schemas/profiles.schema";

export const handleCreateProfile = async (req: Request, res: Response) => {
  const payload = req.body as CreateProfilePayload;
  const profile = await getProfileByName(payload.name);
  if (profile) {
    return res.status(httpStatus.CONFLICT).json({
      message: "Profile with such name already exists",
    });
  }
  await db.insert(profiles).values({
    ...payload,
  });
  res
    .status(httpStatus.CREATED)
    .json({ message: "Successfully created profile" });
};

// Will need to join the compliments with the
export const handleGetProfiles = async (_: Request, res: Response) => {
  const result = await db.select().from(profiles);
  const filted = result.map((p) => {
    return {
      ...p,
      id: undefined,
    };
  });

  res.status(httpStatus.OK).json({
    data: {
      profiles: filted,
    },
  });
};

export const handleUpdateProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body as Partial<CreateProfilePayload>;
  const profile = await getProfileById(id as string);
  if (!profile) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Profile with such id does not exist",
    });
  }
  await db
    .update(profiles)
    .set({
      ...payload,
    })
    .where(eq(profiles.id, id as unknown as number));

  res.status(httpStatus.OK).json({ message: "Successfully updated profile" });
};

export const handleActivateProfiles = async (req: Request, res: Response) => {
  // to be added
};
