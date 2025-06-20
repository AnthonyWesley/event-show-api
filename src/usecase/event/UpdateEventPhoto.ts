import { GoalType } from "@prisma/client";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { CloudinaryUploadService } from "../../infra/services/CloudinaryUploadService";
import fs from "fs";

export type UpdateEventPhotoInputDto = {
  eventId: string;
  partnerId: string;
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
    private readonly partnerGateway: IPartnerGateway,
    private readonly uploadPhotoService: CloudinaryUploadService
  ) {}

  static create(
    eventGateway: IEventGateway,
    partnerGateway: IPartnerGateway,
    uploadPhotoService: CloudinaryUploadService
  ) {
    return new UpdateEventPhoto(
      eventGateway,
      partnerGateway,
      uploadPhotoService
    );
  }

  async execute(
    input: UpdateEventPhotoInputDto
  ): Promise<UpdateEventPhotoOutputDto> {
    if (!input.file) throw new NotFoundError("File");

    const existingPartner = await this.partnerGateway.findById(input.partnerId);
    if (!existingPartner) {
      throw new NotFoundError("Partner");
    }

    const existingEvent = await this.eventGateway.findById({
      eventId: input.eventId,
      partnerId: input.partnerId,
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
      partnerId: existingEvent.partnerId,
    });

    return {
      id: updated.id,
      photo: upload.secure_url,
      photoPublicId: upload.public_id,
    };
  }
}
