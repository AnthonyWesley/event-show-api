import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { CloudinaryUploadService } from "../../infra/services/CloudinaryUploadService";
import fs from "fs";
import { IProductGateway } from "../../domain/entities/product/IProductGateway";

export type UpdateProductPhotoInputDto = {
  productId: string;
  companyId: string;
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
    private readonly companyGateway: ICompanyGateway,
    private readonly uploadPhotoService: CloudinaryUploadService
  ) {}

  static create(
    productGateway: IProductGateway,
    companyGateway: ICompanyGateway,
    uploadPhotoService: CloudinaryUploadService
  ) {
    return new UpdateProductPhoto(
      productGateway,
      companyGateway,
      uploadPhotoService
    );
  }

  async execute(
    input: UpdateProductPhotoInputDto
  ): Promise<UpdateProductPhotoOutputDto> {
    if (!input.file) throw new NotFoundError("File");

    const companyExists = await this.companyGateway.findById(input.companyId);
    if (!companyExists) {
      throw new NotFoundError("Company");
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
      companyId: existingProduct.companyId,
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
