import type { UserSelect } from "./database/schema";
import profileService from "./features/profiles/profile.service";
import storageService from "./features/storage/storage.service";
import userService from "./features/users/user.service";
import path from "node:path";
import fs from "node:fs/promises";
import type { CreateUserProfilePayload } from "./features/profiles/profile.schema";

interface InitData {
  username: string;
  profile: {
    imageName?: string;
    // Add other profile fields here if needed
  };
}

export async function seedDB(): Promise<void> {
  const filePath = path.join(process.cwd(), "src/database/init.json");

  try {
    const buffer = await fs.readFile(filePath);
    const initData: InitData[] = JSON.parse(buffer.toString());

    for (const { username, profile } of initData) {
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          let user = await userService.getUserBy({ username });

          if (!user) {
            user = (await userService.createUser({
              username,
              userRole: "user",
            })) as UserSelect;
          }

          const userProfile = await profileService.getProfileBy({
            userId: user.id,
          });

          if (!userProfile) {
            await profileService.createProfile(
              user.id,
              profile as unknown as CreateUserProfilePayload,
              null,
            );
          } else if (profile.imageName) {
            await profileService.updateProfile(user.id, {
              profileImageUrl: storageService.createLinkToLocalImageFile(
                profile.imageName,
                {
                  isLocal: true,
                },
              ),
            });
          }

          break; // Exit the retry loop if successful
        } catch (err) {
          console.error(`SEED ERROR for user ${username}:`, err);
          attempts++;

          if (attempts >= maxAttempts) {
            console.error(
              `Failed to seed user ${username} after ${maxAttempts} attempts.`,
            );
          }
        }
      }
    }

    console.log("DB SEED IS COMPLETE");
  } catch (err) {
    console.error("Failed to read or parse init.json:", err);
  }
}
