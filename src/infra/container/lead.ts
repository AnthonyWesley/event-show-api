import { CreateLead } from "../../usecase/lead/CreateLead";
import { DeleteLead } from "../../usecase/lead/DeleteLead";
import { ExportLead } from "../../usecase/lead/ExportLead";
import { FindLead } from "../../usecase/lead/FindLead";
import { ListLeadsByEvent } from "../../usecase/lead/ListLeadsByEvent";
import { ListLeadsByCompany } from "../../usecase/lead/ListLeadsByCompany";
import { UpdateLead } from "../../usecase/lead/UpdateLead";
import { ILeadExporter } from "../exporters/ILeadExporter";
import { EventRepositoryPrisma } from "../repositories/event/EventRepositoryPrisma";
import { LeadRepositoryPrisma } from "../repositories/lead/LeadRepositoryPrisma";
import { CompanyRepositoryPrisma } from "../repositories/company/CompanyRepositoryPrisma";
import { LeadSourceRepositoryPrisma } from "../repositories/leadSource/LeadSourceRepositoryPrisma";
import { UpsertLeadCustomValues } from "../../usecase/LeadCustomValues/UpsertLeadCustomValues";
import { InviteRepositoryPrisma } from "../repositories/invite/InviteRepositoryPrisma";
import { AuthTokenService } from "../../service/AuthTokenService";
import { IWhatsAppService } from "../mail/IWhatsAppService";
import { SendScreenAccessInvite } from "../../usecase/company/SendScreenAccessInvite";
import { ScreenAccessService } from "../../usecase/company/ScreenAccessService";

import { ISocketServer } from "../socket/ISocketServer";

export function makeLeadUseCases(
  leadRepository: LeadRepositoryPrisma,
  eventRepository: EventRepositoryPrisma,
  companyRepository: CompanyRepositoryPrisma,
  leadSourceRepository: LeadSourceRepositoryPrisma,
  exporter: ILeadExporter,
  upsertLeadCustomValues: UpsertLeadCustomValues,
  inviteGateway: InviteRepositoryPrisma,
  sendMessageService: IWhatsAppService,
  socketServer: ISocketServer,
  tokenService: AuthTokenService
) {
  return {
    create: CreateLead.create(
      leadRepository,
      eventRepository,
      leadSourceRepository,
      upsertLeadCustomValues
    ),
    findOne: FindLead.create(leadRepository, companyRepository),
    exportLead: ExportLead.create(leadRepository, eventRepository, exporter),
    listByCompany: ListLeadsByCompany.create(leadRepository, companyRepository),
    listByEvent: ListLeadsByEvent.create(leadRepository, eventRepository),
    delete: DeleteLead.create(leadRepository, companyRepository),
    update: UpdateLead.create(
      leadRepository,
      companyRepository,
      upsertLeadCustomValues,
      socketServer
    ),
    sendMessage: SendScreenAccessInvite.create(
      companyRepository,
      eventRepository,
      inviteGateway,
      sendMessageService,
      tokenService
    ),

    collectorAccess: ScreenAccessService.create(
      leadRepository,
      companyRepository,
      eventRepository,
      inviteGateway,
      tokenService
    ),
  };
}
