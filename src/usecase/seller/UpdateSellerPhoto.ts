import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { CloudinaryUploadService } from "../../infra/services/CloudinaryUploadService";
import fs from "fs";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";

export type UpdateSellerPhotoInputDto = {
  sellerId: string;
  companyId: string;
  photo?: string;
  photoPublicId?: string;
  file?: any;
};

export type UpdateSellerPhotoOutputDto = {
  id: string;
  photo: string;
  photoPublicId: string;
};
export class UpdateSellerPhoto {
  constructor(
    private readonly sellerGateway: ISellerGateway,
    private readonly companyGateway: ICompanyGateway,
    private readonly uploadPhotoService: CloudinaryUploadService
  ) {}

  static create(
    sellerGateway: ISellerGateway,
    companyGateway: ICompanyGateway,
    uploadPhotoService: CloudinaryUploadService
  ) {
    return new UpdateSellerPhoto(
      sellerGateway,
      companyGateway,
      uploadPhotoService
    );
  }

  async execute(
    input: UpdateSellerPhotoInputDto
  ): Promise<UpdateSellerPhotoOutputDto> {
    if (!input.file) throw new NotFoundError("File");

    const companyExists = await this.companyGateway.findById(input.companyId);
    if (!companyExists) {
      throw new NotFoundError("Company");
    }

    const existingSeller = await this.sellerGateway.findById(input);
    if (!existingSeller) {
      throw new NotFoundError("Seller");
    }

    if (existingSeller.photoPublicId) {
      await this.uploadPhotoService.deleteImage(existingSeller.photoPublicId);
    }

    const upload = await this.uploadPhotoService.uploadImage(input.file.path, {
      folder: `seller/${existingSeller.id}`,
      public_id: "photo",
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: "thumb", gravity: "face" },
      ],
      tags: ["seller"],
      context: {
        alt: `${existingSeller.name} - foto`,
        caption: "Foto do vendedor",
      },
    });

    fs.unlinkSync(input.file.path);

    const updated = await this.sellerGateway.update({
      companyId: existingSeller.companyId,
      sellerId: existingSeller.id,
      name: existingSeller.name,
      email: existingSeller.email,
      phone: existingSeller.phone,
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
