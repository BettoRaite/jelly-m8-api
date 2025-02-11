import profileService from "./features/profiles/profile.service";
import userService from "./features/users/user.service";

async function seedDB() {
  /*
  ├──
  ├── girly.jpeg
  ├── photo_2024-02-13_00-35-54.jpg
  ├── photo_2024-06-04_11-54-40.jpg
  ├── photo_2025-02-10_12-38-47.jpg
  ├── photo_2025-02-10_12-40-00.jpg
  ├── photo_2025-02-10_12-40-49.jpg
  ├── photo_2025-02-10_12-43-36.jpg
  └── photo_2025-02-10_12-45-51.jpg
  */

  const data = [
    {
      username: "Vika",
      profile: {
        displayName: "Викуся :3",
        gender: "female",
        biography: "Викуся",
        imageName:
          "girly.jpeg",
      }
    },
    {
      username:  "sonya",
      profile:   {
        displayName: "Соня",
        gender: "female",
        biography: "Соня",
        imageName:
          "9fff142e-f71c-47c5-b143-61d7c4030840.jpeg",
      },
    },
    {
      username: "eva",
      profile:  {
        displayName: "Ева",
        gender: "female",
        biography: "пацаны как костер, можно развести и обоссать",
        imageName:
        "photo_2025-02-10_12-45-51.jpg"
      },
    },
    {
      username: "Ulya",
      profile:  {
        displayName: "Юля",
        gender: "female",
        biography: "Юляяя",
        imageName:
        "photo_2024-06-04_11-54-40.jpg"
      },
    },
    {
      username: "Alsy",
      profile:  {
        displayName: "Алсу",
        gender: "female",
        biography: "Алсу",
        imageName:
          "photo_2025-02-10_12-40-49.jpg",
      }
    },
    {
      username:  "Nastya",
      profile: {
        displayName: "Настя",
        gender: "female",
        biography: "Настя",
        imageName:
          "http://localhost:5000/api/v1/image/d94e4ce7-0f88-4f49-929e-fb67821564c1.jpg",
      }
    },
    {
      username: "Vera",
      profile:  {
        displayName: "Вера",
        gender: "female",
        biography: "Вера",
        imageName:
          "http://localhost:5000/api/v1/image/7ccecc28-99c0-4bb7-a8b7-b80aca2be275.jpg",
      },
    }
  ];


  for (const {user,profile} of data) {
    let attempts = 0;
    while (attempts < 3) {
      try {
        let user = await userService.getUserBy({
          username: user?.username,
        });
        if (!user) {
          user = await userService.createUser({
            username: user,
            userRole: "user",
          });
        }
        let profile = await
      } catch (err) {
        console.error("SEED ERROR", err);
        ++attempts;
      }
    }
  }
}
seedDB();
