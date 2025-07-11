import { v2 as cloudinary } from "cloudinary";
import { IUploadService } from "./IUploadService";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export class CloudinaryUploadService implements IUploadService {
  async uploadImage(filePath: string, options: any) {
    return await cloudinary.uploader.upload(filePath, options);
  }

  async deleteImage(publicId: string) {
    await cloudinary.uploader.destroy(publicId);
  }
}
