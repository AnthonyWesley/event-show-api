import { CreatePartnerEvent } from "../../usecase/event/CreatePartnerEvent";
import { DeletePartnerEvent } from "../../usecase/event/DeletePartnerEvent";
import { FindPartnerEvent } from "../../usecase/event/FindPartnerEvent";
import { ListPartnerEvent } from "../../usecase/event/ListPartnerEvent";
import { SwitchPartnerEventState } from "../../usecase/event/SwitchPartnerEventState";
import { UpdateEventPhoto } from "../../usecase/event/UpdateEventPhoto";
import { UpdatePartnerEvent } from "../../usecase/event/UpdatePartnerEvent";
import { partnerRepository } from "../Container";
import { EventRepositoryPrisma } from "../repositories/event/EventRepositoryPrisma";
import { CloudinaryUploadService } from "../services/CloudinaryUploadService";

export function makeEventUseCases(
  eventRepository: EventRepositoryPrisma,
  uploadPhotoService: CloudinaryUploadService
) {
  return {
    create: CreatePartnerEvent.create(eventRepository, partnerRepository),
    list: ListPartnerEvent.create(eventRepository, partnerRepository),
    findOne: FindPartnerEvent.create(eventRepository, partnerRepository),
    SwitchStatus: SwitchPartnerEventState.create(
      eventRepository,
      partnerRepository
    ),
    delete: DeletePartnerEvent.create(eventRepository, partnerRepository),
    update: UpdatePartnerEvent.create(eventRepository, partnerRepository),
    updatePhoto: UpdateEventPhoto.create(
      eventRepository,
      partnerRepository,
      uploadPhotoService
    ),
  };
}
