import { ILeadGateway } from "../../domain/entities/lead/ILeadGateway";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";

import { NotFoundError } from "../../shared/errors/NotFoundError";

export type ListLeadsOutputDto = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  customInterest?: string;
  notes?: string;
  companyId: string;
  createdAt: Date;
  convertedAt?: Date;

  event: { id: string; name: string };
  seller?: { id: string; name: string };
  source?: { id: string; name: string };
  products: { id: string; name: string }[];
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
      phone: lead.phone ?? "",
      wasPresent: lead.wasPresent,

      notes: lead.notes ?? undefined,
      customInterest: lead.customInterest ?? undefined,
      companyId: lead.companyId,
      createdAt: lead.createdAt,
      convertedAt: lead.convertedAt ?? undefined,
      // customValues: lead.customValues ?? undefined,

      event: {
        id: lead.event?.id ?? lead.eventId,
        name: lead.event?.name ?? "Evento desconhecido",
      },
      seller: lead.seller
        ? { id: lead.seller.id, name: lead.seller.name }
        : undefined,

      source: lead.leadSource
        ? { id: lead.leadSource?.id, name: lead.leadSource.name }
        : undefined,
      products:
        lead.products?.map((p) => ({
          id: p.id,
          name: p.name,
        })) ?? [],
    }));
  }
}
