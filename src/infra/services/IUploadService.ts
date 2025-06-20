export interface IUploadService {
  uploadImage(
    filePath: string,
    options: any
  ): Promise<{
    secure_url: string;
    public_id: string;
  }>;
  deleteImage(publicId: string): Promise<void>;
}
