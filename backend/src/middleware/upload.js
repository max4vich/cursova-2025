const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, callback) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    callback(null, `${unique}${ext}`);
  },
});

const fileFilter = (_req, file, callback) => {
  if (!file.mimetype.startsWith("image/")) {
    callback(new Error("Підтримуються тільки зображення"));
  } else {
    callback(null, true);
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

