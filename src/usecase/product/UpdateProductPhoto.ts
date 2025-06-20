import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { CloudinaryUploadService } from "../../infra/services/CloudinaryUploadService";
import fs from "fs";
import { IProductGateway } from "../../domain/entities/product/IProductGateway";

export type UpdateProductPhotoInputDto = {
  productId: string;
  partnerId: string;
  photo?: string;
  photoPublicId?: string;
  file?: any;
};

export type UpdateProductPhotoOutputDto = {
  id: string;
  photo: string;
  photoPublicId: string;
};
export class UpdateProductPhoto {
  constructor(
    private readonly productGateway: IProductGateway,
    private readonly partnerGateway: IPartnerGateway,
    private readonly uploadPhotoService: CloudinaryUploadService
  ) {}

  static create(
    productGateway: IProductGateway,
    partnerGateway: IPartnerGateway,
    uploadPhotoService: CloudinaryUploadService
  ) {
    return new UpdateProductPhoto(
      productGateway,
      partnerGateway,
      uploadPhotoService
    );
  }

  async execute(
    input: UpdateProductPhotoInputDto
  ): Promise<UpdateProductPhotoOutputDto> {
    if (!input.file) throw new NotFoundError("File");

    const partnerExists = await this.partnerGateway.findById(input.partnerId);
    if (!partnerExists) {
      throw new NotFoundError("Partner");
    }

    const existingProduct = await this.productGateway.findById(input);
    if (!existingProduct) {
      throw new NotFoundError("Product");
    }

    if (existingProduct.photoPublicId) {
      await this.uploadPhotoService.deleteImage(existingProduct.photoPublicId);
    }

    const upload = await this.uploadPhotoService.uploadImage(input.file.path, {
      folder: `product/${existingProduct.id}`,
      public_id: "product",
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: "thumb", gravity: "face" },
      ],
      tags: ["product"],
      context: {
        alt: `${existingProduct.name} - foto`,
        caption: "Foto do produto",
      },
    });

    fs.unlinkSync(input.file.path);

    const updated = await this.productGateway.update({
      productId: existingProduct.id,
      name: existingProduct.name,
      price: existingProduct.price,
      partnerId: existingProduct.partnerId,
      photo: upload.secure_url,
      photoPublicId: upload.public_id,
    });

    return {
      id: updated.id,
      photo: upload.secure_url,
      photoPublicId: upload.public_id,
    };
  }
}
