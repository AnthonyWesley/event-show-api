import { CreateEvent } from "../../usecase/event/CreateEvent";
import { DeleteEvent } from "../../usecase/event/DeleteEvent";
import { FindEvent } from "../../usecase/event/FindEvent";
import { ListEvent } from "../../usecase/event/ListEvent";
import { SwitchEventState } from "../../usecase/event/SwitchEventState";
import { UpdateEvent } from "../../usecase/event/UpdateEvent";
import { UpdateEventPhoto } from "../../usecase/event/UpdateEventPhoto";
import { UpdateSellersGoalService } from "../../usecase/event/UpdateSellersGoalService";
import { CompanyRepositoryPrisma } from "../repositories/company/CompanyRepositoryPrisma";
import { EventRepositoryPrisma } from "../repositories/event/EventRepositoryPrisma";
import { CloudinaryUploadService } from "../services/CloudinaryUploadService";
import { ISocketServer } from "../socket/ISocketServer";
import { SocketServer } from "../socket/SocketServer";

export function makeEventUseCases(
  eventRepository: EventRepositoryPrisma,
  companyRepository: CompanyRepositoryPrisma,
  uploadPhotoService: CloudinaryUploadService,
  updateSellersGoalService: UpdateSellersGoalService,
  socketServer: ISocketServer
) {
  return {
    create: CreateEvent.create(
      eventRepository,
      companyRepository,
      socketServer
    ),
    list: ListEvent.create(eventRepository, companyRepository),
    findOne: FindEvent.create(eventRepository, companyRepository),
    SwitchStatus: SwitchEventState.create(eventRepository, companyRepository),
    delete: DeleteEvent.create(
      eventRepository,
      companyRepository,
      socketServer
    ),
    update: UpdateEvent.create(
      eventRepository,
      companyRepository,
      socketServer,
      updateSellersGoalService
    ),
    updatePhoto: UpdateEventPhoto.create(
      eventRepository,
      companyRepository,
      uploadPhotoService
    ),
  };
}
