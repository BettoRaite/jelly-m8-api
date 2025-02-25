import { v4 as uuidv4 } from "uuid";

export const getRandSecret = (length = 255) =>
  uuidv4({
    random: {
      length,
    },
  });
