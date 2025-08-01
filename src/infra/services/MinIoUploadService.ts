import dotenv from "dotenv";
dotenv.config();

import * as Minio from "minio";
import { ObjectMetaData } from "minio/dist/main/internal/type";
import mime from "mime-types";
import path from "path";
import fs from "fs";

if (
  !process.env.MINIO_ENDPOINT ||
  !process.env.MINIO_ACCESS_KEY ||
  !process.env.MINIO_SECRET_KEY ||
  !process.env.MINIO_BUCKET ||
  !process.env.MINIO_PORT
) {
  throw new Error(
    "❌ Variáveis de ambiente do MinIO não estão configuradas corretamente."
  );
}

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT || "9000", 10),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

export type MinIoOptions = {
  objectName: string;
  metaData?: ObjectMetaData;
};

export class MinIoUploadService {
  async uploadImage(filePath: string, options: MinIoOptions) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const contentType = mime.lookup(filePath) || "application/octet-stream";

    const metaData: ObjectMetaData = options.metaData || {
      "Content-Type": contentType,
    };

    await minioClient.fPutObject(
      process.env.MINIO_BUCKET ?? "",
      options.objectName,
      filePath,
      metaData
    );

    const photo = `https://${process.env.MINIO_ENDPOINT}/${
      process.env.MINIO_BUCKET
    }/${encodeURIComponent(options.objectName)}`;
    return {
      photo,
      photoPublicId: options.objectName,
    };
  }
}
