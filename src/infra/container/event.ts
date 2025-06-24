import { CreateEvent } from "../../usecase/event/CreateEvent";
import { DeleteEvent } from "../../usecase/event/DeleteEvent";
import { FindEvent } from "../../usecase/event/FindEvent";
import { ListEvent } from "../../usecase/event/ListEvent";
import { SwitchEventState } from "../../usecase/event/SwitchEventState";
import { UpdateEvent } from "../../usecase/event/UpdateEvent";
import { UpdateEventPhoto } from "../../usecase/event/UpdateEventPhoto";
import { partnerRepository } from "../Container";
import { EventRepositoryPrisma } from "../repositories/event/EventRepositoryPrisma";
import { CloudinaryUploadService } from "../services/CloudinaryUploadService";

export function makeEventUseCases(
  eventRepository: EventRepositoryPrisma,
  uploadPhotoService: CloudinaryUploadService
) {
  return {
    create: CreateEvent.create(eventRepository, partnerRepository),
    list: ListEvent.create(eventRepository, partnerRepository),
    findOne: FindEvent.create(eventRepository, partnerRepository),
    SwitchStatus: SwitchEventState.create(eventRepository, partnerRepository),
    delete: DeleteEvent.create(eventRepository, partnerRepository),
    update: UpdateEvent.create(eventRepository, partnerRepository),
    updatePhoto: UpdateEventPhoto.create(
      eventRepository,
      partnerRepository,
      uploadPhotoService
    ),
  };
}
