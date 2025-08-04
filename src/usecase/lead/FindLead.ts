import { ILeadGateway } from "../../domain/entities/lead/ILeadGateway";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";

import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type FindLeadInputDto = {
  companyId: string;
  leadId: string;
};

export type FindLeadOutputDto = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  customInterest?: string;
  notes?: string;
  companyId: string;
  createdAt: Date;
  convertedAt?: Date;

  event: { id: string; name: string };
  seller?: { id: string; name: string };
  source?: { id: string; name: string };
  products: { id: string; name: string }[];
};

export class FindLead
  implements IUseCases<FindLeadInputDto, FindLeadOutputDto>
{
  private constructor(
    private readonly leadGateway: ILeadGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  public static create(
    leadGateway: ILeadGateway,
    companyGateway: ICompanyGateway
  ) {
    return new FindLead(leadGateway, companyGateway);
  }

  public async execute(input: FindLeadInputDto): Promise<FindLeadOutputDto> {
    const company = await this.companyGateway.findById(input.companyId);
    if (!company) throw new Error("Company not found");

    const lead = await this.leadGateway.findById(input);
    if (!lead) throw new NotFoundError("Lead");

    return {
      id: lead.id,
      name: lead.name,
      // email: lead.email ?? undefined,
      // phone: lead.phone ?? undefined,
      notes: lead.notes ?? undefined,
      customInterest: lead.customInterest ?? undefined,
      companyId: lead.companyId,
      createdAt: lead.createdAt,
      convertedAt: lead.convertedAt ?? undefined,
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
    };
  }
}
