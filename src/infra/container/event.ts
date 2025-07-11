import { CreateEvent } from "../../usecase/event/CreateEvent";
import { DeleteEvent } from "../../usecase/event/DeleteEvent";
import { FindEvent } from "../../usecase/event/FindEvent";
import { ListEvent } from "../../usecase/event/ListEvent";
import { SwitchEventState } from "../../usecase/event/SwitchEventState";
import { UpdateEvent } from "../../usecase/event/UpdateEvent";
import { UpdateEventPhoto } from "../../usecase/event/UpdateEventPhoto";
import { CompanyRepositoryPrisma } from "../repositories/company/CompanyRepositoryPrisma";
import { EventRepositoryPrisma } from "../repositories/event/EventRepositoryPrisma";
import { CloudinaryUploadService } from "../services/CloudinaryUploadService";

export function makeEventUseCases(
  eventRepository: EventRepositoryPrisma,
  companyRepository: CompanyRepositoryPrisma,
  uploadPhotoService: CloudinaryUploadService
) {
  return {
    create: CreateEvent.create(eventRepository, companyRepository),
    list: ListEvent.create(eventRepository, companyRepository),
    findOne: FindEvent.create(eventRepository, companyRepository),
    SwitchStatus: SwitchEventState.create(eventRepository, companyRepository),
    delete: DeleteEvent.create(eventRepository, companyRepository),
    update: UpdateEvent.create(eventRepository, companyRepository),
    updatePhoto: UpdateEventPhoto.create(
      eventRepository,
      companyRepository,
      uploadPhotoService
    ),
  };
}
