import { ILeadGateway } from "../../domain/entities/lead/ILeadGateway";
import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";

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
  partnerId: string;
  createdAt: Date;
}[];

export class ListLeadsByPartner {
  constructor(
    private readonly leadGateway: ILeadGateway,
    private readonly partnerGateway: IPartnerGateway
  ) {}

  static create(leadGateway: ILeadGateway, partnerGateway: IPartnerGateway) {
    return new ListLeadsByPartner(leadGateway, partnerGateway);
  }

  async execute(partnerId: string): Promise<ListLeadsOutputDto> {
    const partner = await this.partnerGateway.findById(partnerId);
    if (!partner) {
      throw new NotFoundError("Partner");
    }

    const leads = await this.leadGateway.listByPartner(partner.id);

    return leads.map((lead) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email ?? undefined,
      phone: lead.phone ?? undefined,
      notes: lead.notes ?? undefined,
      source: lead.source,
      customInterest: lead.customInterest ?? undefined,
      eventId: lead.eventId,
      partnerId: lead.partnerId,
      createdAt: lead.createdAt,
      products: lead.products ?? [],
    }));
  }
}
