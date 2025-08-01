import { CreateLead } from "../../usecase/lead/CreateLead";
import { DeleteLead } from "../../usecase/lead/DeleteLead";
import { FindLead } from "../../usecase/lead/FindLead";
import { ListLeadsByCompany } from "../../usecase/lead/ListLeadsByCompany";
import { UpdateLead } from "../../usecase/lead/UpdateLead";
import { CreateLeadSource } from "../../usecase/leadSource/CreateLeadSource";
import { DeleteLeadSource } from "../../usecase/leadSource/DeleteLeadSource";
import { FindLeadSource } from "../../usecase/leadSource/FindLeadSource";
import { ListLeadSource } from "../../usecase/leadSource/ListLeadSource";
import { UpdateLeadSource } from "../../usecase/leadSource/UpdateLeadSource";

import { CompanyRepositoryPrisma } from "../repositories/company/CompanyRepositoryPrisma";
import { LeadSourceRepositoryPrisma } from "../repositories/leadSource/LeadSourceRepositoryPrisma";

export function makeLeadSourceUseCases(
  leadSourceRepository: LeadSourceRepositoryPrisma,
  companyRepository: CompanyRepositoryPrisma
) {
  return {
    create: CreateLeadSource.create(leadSourceRepository, companyRepository),
    list: ListLeadSource.create(leadSourceRepository, companyRepository),
    findOne: FindLeadSource.create(leadSourceRepository, companyRepository),
    delete: DeleteLeadSource.create(leadSourceRepository, companyRepository),
    update: UpdateLeadSource.create(leadSourceRepository, companyRepository),
  };
}
