import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { ILeadGateway } from "../../domain/entities/lead/ILeadGateway";

import { NotFoundError } from "../../shared/errors/NotFoundError";

export type ListLeadsInputDto = {
  partnerId: string;
  eventId: string;
};

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

export class ListLeadsByEvent {
  constructor(
    private readonly leadGateway: ILeadGateway,
    private readonly eventGateway: IEventGateway
  ) {}

  static create(leadGateway: ILeadGateway, eventGateway: IEventGateway) {
    return new ListLeadsByEvent(leadGateway, eventGateway);
  }

  async execute(input: ListLeadsInputDto): Promise<ListLeadsOutputDto> {
    const event = await this.eventGateway.findById({
      eventId: input.eventId,
      partnerId: input.partnerId,
    });
    if (!event) {
      throw new NotFoundError("");
    }

    const leads = await this.leadGateway.listByEvent(event.id);

    return leads.map((lead) => ({
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
    }));
  }
}
