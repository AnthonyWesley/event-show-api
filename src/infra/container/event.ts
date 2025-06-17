import { CreatePartnerEvent } from "../../usecase/event/CreatePartnerEvent";
import { DeletePartnerEvent } from "../../usecase/event/DeletePartnerEvent";
import { FindPartnerEvent } from "../../usecase/event/FindPartnerEvent";
import { GenerateEventReport } from "../../usecase/event/GenerateEventReport";
import { ListPartnerEvent } from "../../usecase/event/ListPartnerEvent";
import { SwitchPartnerEventState } from "../../usecase/event/SwitchPartnerEventState";
import { UpdatePartnerEvent } from "../../usecase/event/UpdatePartnerEvent";
import { partnerRepository } from "../Container";
import { PdfEventExporter } from "../exporters/PdfEventExporter";
import { EventRepositoryPrisma } from "../repositories/event/EventRepositoryPrisma";

export function makeEventUseCases(
  eventRepository: EventRepositoryPrisma,
  exporterPdf: PdfEventExporter
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
    export: GenerateEventReport.create(
      eventRepository,
      partnerRepository,
      exporterPdf
    ),
  };
}
