import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.resolve(
  process.env.TMPDIR || "./tmp" // Usa ./tmp localmente
);

// Função para garantir que o diretório existe
const ensureUploadDir = () => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureUploadDir(); // Cria o diretório apenas quando necessário
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

export const upload = multer({ storage });
