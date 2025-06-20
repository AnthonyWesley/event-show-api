import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { Partner } from "../../domain/entities/partner/Partner";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";
import fs from "fs";
import { CloudinaryUploadService } from "../../infra/services/CloudinaryUploadService";

export type UpdatePartnerPhotoInputDto = {
  id: string;
  photo?: string;
  photoPublicId?: string;
  file?: any;
};

export type UpdatePartnerPhotoOutputDto = {
  id: string;
  photo: string;
  photoPublicId: string;
};

export class UpdatePartnerPhoto
  implements IUseCases<UpdatePartnerPhotoInputDto, UpdatePartnerPhotoOutputDto>
{
  private constructor(
    private readonly partnerGateway: IPartnerGateway,
    private readonly uploadPhotoService: CloudinaryUploadService
  ) {}

  static create(
    partnerGateway: IPartnerGateway,
    uploadPhotoService: CloudinaryUploadService
  ) {
    return new UpdatePartnerPhoto(partnerGateway, uploadPhotoService);
  }

  async execute(
    input: UpdatePartnerPhotoInputDto
  ): Promise<UpdatePartnerPhotoOutputDto> {
    if (!input.file) throw new NotFoundError("File");

    const existingPartner = await this.partnerGateway.findById(input.id);
    if (!existingPartner) {
      throw new NotFoundError("Partner");
    }

    if (existingPartner.photoPublicId) {
      await this.uploadPhotoService.deleteImage(existingPartner.photoPublicId);
    }

    const upload = await this.uploadPhotoService.uploadImage(input.file.path, {
      folder: `partner/${existingPartner.id}`,
      public_id: "photo",
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: "thumb", gravity: "face" },
      ],
      tags: ["partner"],
      context: {
        alt: `${existingPartner.name} - foto`,
        caption: "Foto do parceiro",
      },
    });

    fs.unlinkSync(input.file.path);

    const updatedPartner = Partner.with({
      id: existingPartner.id,
      name: existingPartner.name,
      email: existingPartner.email,
      password: existingPartner.password,
      phone: existingPartner.phone,
      photo: upload.secure_url,
      photoPublicId: upload.public_id,
      plan: existingPartner.plan,
      products: existingPartner.products,
      status: existingPartner.status,
      events: existingPartner.events,
      accessExpiresAt: existingPartner.accessExpiresAt,
      createdAt: existingPartner.createdAt,
    });

    const updated = await this.partnerGateway.update(input.id, updatedPartner);

    return {
      id: updated.id,
      photo: upload.secure_url,
      photoPublicId: upload.public_id,
    };
  }
}
