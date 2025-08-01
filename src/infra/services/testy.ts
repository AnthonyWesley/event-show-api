import dotenv from "dotenv";
dotenv.config();

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

if (
  !process.env.MINIO_ENDPOINT ||
  !process.env.MINIO_ACCESS_KEY ||
  !process.env.MINIO_SECRET_KEY ||
  !process.env.MINIO_BUCKET
) {
  throw new Error(
    "❌ Variáveis de ambiente do MinIO não estão configuradas corretamente."
  );
}

const s3 = new S3Client({
  region: "us-east-1",
  endpoint: process.env.MINIO_ENDPOINT,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true,
});

export class MinIoUploadService {
  async uploadImage(filePath: string): Promise<void> {
    try {
      const fileName = path.basename(filePath);

      const uploadParams = {
        Bucket: process.env.MINIO_BUCKET!,
        Key: `uploads/${fileName}`,
        Body: fs.createReadStream(filePath),
        ContentType: "image/jpeg",
      };

      const result = await s3.send(new PutObjectCommand(uploadParams));

      console.log("✅ Upload realizado com sucesso:", result);
      console.log(
        `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET}/uploads/${fileName}`
      );
    } catch (err) {
      console.error("❌ Erro ao fazer upload:", err);
    }
  }
}
