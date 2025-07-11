import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { Company } from "../../domain/entities/company/Company";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";
import fs from "fs";
import { CloudinaryUploadService } from "../../infra/services/CloudinaryUploadService";

export type UpdateCompanyPhotoInputDto = {
  id: string;
  photo?: string;
  photoPublicId?: string;
  file?: any;
};

export type UpdateCompanyPhotoOutputDto = {
  id: string;
  photo: string;
  photoPublicId: string;
};

export class UpdateCompanyPhoto
  implements IUseCases<UpdateCompanyPhotoInputDto, UpdateCompanyPhotoOutputDto>
{
  private constructor(
    private readonly companyGateway: ICompanyGateway,
    private readonly uploadPhotoService: CloudinaryUploadService
  ) {}

  static create(
    companyGateway: ICompanyGateway,
    uploadPhotoService: CloudinaryUploadService
  ) {
    return new UpdateCompanyPhoto(companyGateway, uploadPhotoService);
  }

  async execute(
    input: UpdateCompanyPhotoInputDto
  ): Promise<UpdateCompanyPhotoOutputDto> {
    if (!input.file) throw new NotFoundError("File");

    const existingCompany = await this.companyGateway.findById(input.id);
    if (!existingCompany) {
      throw new NotFoundError("Company");
    }

    if (existingCompany.photoPublicId) {
      await this.uploadPhotoService.deleteImage(existingCompany.photoPublicId);
    }

    const upload = await this.uploadPhotoService.uploadImage(input.file.path, {
      folder: `company/${existingCompany.id}`,
      public_id: "photo",
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: "thumb", gravity: "face" },
      ],
      tags: ["company"],
      context: {
        alt: `${existingCompany.name} - foto`,
        caption: "Foto da empresa",
      },
    });

    fs.unlinkSync(input.file.path);

    const updatedCompany = Company.with({
      id: existingCompany.id,
      name: existingCompany.name,
      email: existingCompany.email,
      phone: existingCompany.phone,
      plan: existingCompany.plan,
      products: existingCompany.products,
      status: existingCompany.status,
      events: existingCompany.events,
      accessExpiresAt: existingCompany.accessExpiresAt,
      createdAt: existingCompany.createdAt,
      cnpj: existingCompany.cnpj,
      ie: existingCompany.ie,
      responsibleName: existingCompany.responsibleName,
      address: existingCompany.address,
      city: existingCompany.city,
      state: existingCompany.state,
      zipCode: existingCompany.zipCode,
      website: existingCompany.website,
      segment: existingCompany.segment,
      notes: existingCompany.notes,

      photo: upload.secure_url,
      photoPublicId: upload.public_id,
    });

    const updated = await this.companyGateway.update(input.id, updatedCompany);

    return {
      id: updated.id,
      photo: upload.secure_url,
      photoPublicId: upload.public_id,
    };
  }
}
