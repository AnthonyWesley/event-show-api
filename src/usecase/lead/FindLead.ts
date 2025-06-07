import { ILeadGateway } from "../../domain/entities/lead/ILeadGateway";
import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";

import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type FindLeadInputDto = {
  partnerId: string;
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
  partnerId: string;
  createdAt: Date;
};

export class FindLead
  implements IUseCases<FindLeadInputDto, FindLeadOutputDto>
{
  private constructor(
    private readonly leadGateway: ILeadGateway,
    private readonly partnerGateway: IPartnerGateway
  ) {}

  public static create(
    leadGateway: ILeadGateway,
    partnerGateway: IPartnerGateway
  ) {
    return new FindLead(leadGateway, partnerGateway);
  }

  public async execute(input: FindLeadInputDto): Promise<FindLeadOutputDto> {
    const partnerExists = await this.partnerGateway.findById(input.partnerId);
    if (!partnerExists) {
      throw new Error("Partner not found.");
    }

    const lead = await this.leadGateway.findById({
      leadId: input.leadId,
      partnerId: input.partnerId,
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
      partnerId: lead.partnerId,
      createdAt: lead.createdAt,
      products: lead.products ?? [],
    };
  }
}
