import { v4 as uuidv4 } from "uuid";

export const getRandSecret = (maxLen = 255) => {
  const rstr = uuidv4();
  return rstr.slice(0, maxLen);
};
