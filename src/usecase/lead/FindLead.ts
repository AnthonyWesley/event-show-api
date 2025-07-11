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
  products: { id: string }[];

  customInterest?: string;
  notes?: string;
  source: string;
  eventId: string;
  companyId: string;
  createdAt: Date;
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
    const companyExists = await this.companyGateway.findById(input.companyId);
    if (!companyExists) {
      throw new Error("Company not found.");
    }

    const lead = await this.leadGateway.findById({
      leadId: input.leadId,
      companyId: input.companyId,
    });
    if (!lead) {
      throw new NotFoundError("Lead");
    }

    return {
      id: lead.id,
      name: lead.name,
      email: lead.email ?? "",
      phone: lead.phone ?? "",
      notes: lead.notes ?? "",
      source: lead.source,
      customInterest: lead.customInterest ?? "",
      eventId: lead.eventId,
      companyId: lead.companyId,
      createdAt: lead.createdAt,
      products: lead.products ?? [],
    };
  }
}
