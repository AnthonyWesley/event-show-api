import { NotFoundError } from "../../shared/errors/NotFoundError";
import { CloudinaryUploadService } from "../../infra/services/CloudinaryUploadService";
import fs from "fs";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { ILeadSourceGateway } from "../../domain/entities/leadSource/ILeadSourceGateway";
import { LeadSource } from "../../domain/entities/leadSource/LeadSource";
import { ObjectHelper } from "../../shared/utils/ObjectHelper";

export type UpdateLeadSourcePhotoInputDto = {
  leadSourceId: string;
  companyId: string;
  photo?: string;
  photoPublicId?: string;
  file?: any;
};

export type UpdateLeadSourcePhotoOutputDto = {
  id: string;
  photo: string;
  photoPublicId: string;
};
export class UpdateLeadSourcePhoto {
  constructor(
    private readonly leadSourceGateway: ILeadSourceGateway,
    private readonly companyGateway: ICompanyGateway,
    private readonly uploadPhotoService: CloudinaryUploadService
  ) {}

  static create(
    leadSourceGateway: ILeadSourceGateway,
    companyGateway: ICompanyGateway,
    uploadPhotoService: CloudinaryUploadService
  ) {
    return new UpdateLeadSourcePhoto(
      leadSourceGateway,
      companyGateway,
      uploadPhotoService
    );
  }

  async execute(
    input: UpdateLeadSourcePhotoInputDto
  ): Promise<UpdateLeadSourcePhotoOutputDto> {
    if (!input.file) throw new NotFoundError("File");

    const existingCompany = await this.companyGateway.findById(input.companyId);
    if (!existingCompany) {
      throw new NotFoundError("Company");
    }

    const existSource = await this.leadSourceGateway.findById(
      input.leadSourceId
    );
    if (!existSource) {
      throw new NotFoundError("LeadSource");
    }
    if (existSource.photoPublicId) {
      await this.uploadPhotoService.deleteImage(existSource.photoPublicId);
    }

    const upload = await this.uploadPhotoService.uploadImage(input.file.path, {
      folder: `source/${existSource.id}`,
      public_id: "source",
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: "thumb", gravity: "face" },
      ],
      tags: ["source"],
      context: {
        alt: `${existSource.name} - foto`,
        caption: "Foto do evento",
      },
    });

    fs.unlinkSync(input.file.path);

    const merged = ObjectHelper.mergePartial(existSource, {
      photo: upload.secure_url,
      photoPublicId: upload.public_id,
    });

    const aSourcePhoto = LeadSource.with(merged);

    await this.leadSourceGateway.update(input.leadSourceId, aSourcePhoto);

    return {
      id: merged.id,
      photo: upload.secure_url,
      photoPublicId: upload.public_id,
    };
  }
}
