import multer from "multer";
import { v4 as uuidv4 } from "uuid";

export const storageConfig = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "./tmp/uploads");
  },
  filename: (_, file, cb) => {
    const extension = file.originalname.slice(
      file.originalname.lastIndexOf("."),
    );
    const fileName = `${uuidv4()}${extension}`;
    cb(null, fileName);
  },
});
