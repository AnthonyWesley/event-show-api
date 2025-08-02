import { v2 as cloudinary } from "cloudinary";
import { IUploadService } from "./IUploadService";

export class CloudinaryUploadService implements IUploadService {
  private cloudinary: any;

  constructor() {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error(
        "❌ Variáveis de ambiente do Cloudinary não estão configuradas corretamente."
      );
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    
    this.cloudinary = cloudinary;
  }

  async uploadImage(filePath: string, options: any) {
    return await this.cloudinary.uploader.upload(filePath, options);
  }

  async deleteImage(publicId: string) {
    await this.cloudinary.uploader.destroy(publicId);
  }
}
