import { ILeadGateway } from "../../domain/entities/lead/ILeadGateway";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";

import { NotFoundError } from "../../shared/errors/NotFoundError";

export type ListLeadsOutputDto = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  products: { id: string }[];

  customInterest?: string;
  notes?: string;
  source: string;
  eventId: string;
  companyId: string;
  createdAt: Date;
}[];

export class ListLeadsByCompany {
  constructor(
    private readonly leadGateway: ILeadGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  static create(leadGateway: ILeadGateway, companyGateway: ICompanyGateway) {
    return new ListLeadsByCompany(leadGateway, companyGateway);
  }

  async execute(companyId: string): Promise<ListLeadsOutputDto> {
    const company = await this.companyGateway.findById(companyId);
    if (!company) {
      throw new NotFoundError("Company");
    }

    const leads = await this.leadGateway.listByCompany(company.id);

    return leads.map((lead) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email ?? undefined,
      phone: lead.phone ?? undefined,
      notes: lead.notes ?? undefined,
      source: lead.source,
      customInterest: lead.customInterest ?? undefined,
      eventId: lead.eventId,
      companyId: lead.companyId,
      createdAt: lead.createdAt,
      products: lead.products ?? [],
    }));
  }
}
