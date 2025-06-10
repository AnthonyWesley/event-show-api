import { ILeadGateway } from "../../domain/entities/lead/ILeadGateway";
import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { ProductProps } from "../../domain/entities/product/Product";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export type UpdateLeadInputDto = {
  name?: string;
  email?: string;
  phone?: string;
  products?: { id: string }[];

  customInterest?: string;
  notes?: string;
  source?: string;

  leadId: string;
  partnerId: string;
  eventId: string;
};

export type UpdateLeadOutputDto = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  products: { id: string }[];
  customInterest?: string;
  notes?: string;
  source: string;
  partnerId: string;
  createdAt: Date;
};

export class UpdateLead {
  constructor(
    private readonly leadGateway: ILeadGateway,
    private readonly partnerGateway: IPartnerGateway
  ) {}

  static create(leadGateway: ILeadGateway, partnerGateway: IPartnerGateway) {
    return new UpdateLead(leadGateway, partnerGateway);
  }

  async execute(input: UpdateLeadInputDto): Promise<UpdateLeadOutputDto> {
    const partner = await this.partnerGateway.findById(input.partnerId);
    if (!partner) {
      throw new NotFoundError("Partner");
    }

    const lead = await this.leadGateway.findById({
      leadId: input.leadId,
      partnerId: input.partnerId,
      eventId: input.eventId,
    });
    if (!lead) {
      throw new NotFoundError("Lead");
    }

    const updatedLead = await this.leadGateway.update(input);

    return {
      id: updatedLead.id,
      name: updatedLead.name,
      email: updatedLead.email ?? "",
      phone: updatedLead.phone ?? "",
      notes: updatedLead.notes ?? "",
      source: updatedLead.source,
      customInterest: updatedLead.customInterest,
      partnerId: updatedLead.partnerId,
      products: updatedLead.products ?? [],
      createdAt: updatedLead.createdAt,
    };
  }
}
