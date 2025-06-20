import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { CloudinaryUploadService } from "../../infra/services/CloudinaryUploadService";
import fs from "fs";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";

export type UpdateSellerPhotoInputDto = {
  sellerId: string;
  partnerId: string;
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
    private readonly partnerGateway: IPartnerGateway,
    private readonly uploadPhotoService: CloudinaryUploadService
  ) {}

  static create(
    sellerGateway: ISellerGateway,
    partnerGateway: IPartnerGateway,
    uploadPhotoService: CloudinaryUploadService
  ) {
    return new UpdateSellerPhoto(
      sellerGateway,
      partnerGateway,
      uploadPhotoService
    );
  }

  async execute(
    input: UpdateSellerPhotoInputDto
  ): Promise<UpdateSellerPhotoOutputDto> {
    if (!input.file) throw new NotFoundError("File");

    const partnerExists = await this.partnerGateway.findById(input.partnerId);
    if (!partnerExists) {
      throw new NotFoundError("Partner");
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
      partnerId: existingSeller.partnerId,
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
