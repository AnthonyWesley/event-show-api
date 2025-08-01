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

export function makeLeadUseCases(
  leadRepository: LeadRepositoryPrisma,
  eventRepository: EventRepositoryPrisma,
  companyRepository: CompanyRepositoryPrisma,
  leadSourceRepository: LeadSourceRepositoryPrisma,
  exporter: ILeadExporter
) {
  return {
    create: CreateLead.create(
      leadRepository,
      eventRepository,
      leadSourceRepository
    ),
    findOne: FindLead.create(leadRepository, companyRepository),
    exportLead: ExportLead.create(leadRepository, eventRepository, exporter),
    listByCompany: ListLeadsByCompany.create(leadRepository, companyRepository),
    listByEvent: ListLeadsByEvent.create(leadRepository, eventRepository),
    delete: DeleteLead.create(leadRepository, companyRepository),
    update: UpdateLead.create(leadRepository, companyRepository),
  };
}
