import multer from "multer";
import fs from "fs";

// Diretório temporário para ambientes serverless
const uploadDir = process.env.TMPDIR || "/tmp";

// (opcional, mas geralmente já existe em serverless)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

export const upload = multer({ storage });
