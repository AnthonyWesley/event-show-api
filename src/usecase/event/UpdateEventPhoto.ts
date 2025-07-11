import { GoalType } from "@prisma/client";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { CloudinaryUploadService } from "../../infra/services/CloudinaryUploadService";
import fs from "fs";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";

export type UpdateEventPhotoInputDto = {
  eventId: string;
  companyId: string;
  photo?: string;
  photoPublicId?: string;
  file?: any;
};

export type UpdateEventPhotoOutputDto = {
  id: string;
  photo: string;
  photoPublicId: string;
};
export class UpdateEventPhoto {
  constructor(
    private readonly eventGateway: IEventGateway,
    private readonly companyGateway: ICompanyGateway,
    private readonly uploadPhotoService: CloudinaryUploadService
  ) {}

  static create(
    eventGateway: IEventGateway,
    companyGateway: ICompanyGateway,
    uploadPhotoService: CloudinaryUploadService
  ) {
    return new UpdateEventPhoto(
      eventGateway,
      companyGateway,
      uploadPhotoService
    );
  }

  async execute(
    input: UpdateEventPhotoInputDto
  ): Promise<UpdateEventPhotoOutputDto> {
    if (!input.file) throw new NotFoundError("File");

    const existingCompany = await this.companyGateway.findById(input.companyId);
    if (!existingCompany) {
      throw new NotFoundError("Company");
    }

    const existingEvent = await this.eventGateway.findById({
      eventId: input.eventId,
      companyId: input.companyId,
    });

    if (!existingEvent) {
      throw new NotFoundError("Event");
    }

    if (existingEvent.photoPublicId) {
      await this.uploadPhotoService.deleteImage(existingEvent.photoPublicId);
    }

    const upload = await this.uploadPhotoService.uploadImage(input.file.path, {
      folder: `event/${existingEvent.id}`,
      public_id: "photo",
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: "thumb", gravity: "face" },
      ],
      tags: ["event"],
      context: {
        alt: `${existingEvent.name} - foto`,
        caption: "Foto do evento",
      },
    });

    fs.unlinkSync(input.file.path);

    const updated = await this.eventGateway.update({
      eventId: existingEvent.id,
      name: existingEvent.name,
      startDate: existingEvent.startDate,
      endDate: existingEvent.endDate ?? null,
      photo: upload.secure_url,
      photoPublicId: upload.public_id,
      isActive: existingEvent.isActive,
      goal: existingEvent.goal,
      goalType: existingEvent.goalType as GoalType,
      companyId: existingEvent.companyId,
    });

    return {
      id: updated.id,
      photo: upload.secure_url,
      photoPublicId: upload.public_id,
    };
  }
}
