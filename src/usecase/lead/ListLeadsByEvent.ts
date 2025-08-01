import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { ILeadGateway } from "../../domain/entities/lead/ILeadGateway";

import { NotFoundError } from "../../shared/errors/NotFoundError";

export type ListLeadsInputDto = {
  companyId: string;
  eventId: string;
};

export type ListLeadsOutputDto = {
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
      companyId: input.companyId,
    });
    if (!event) {
      throw new NotFoundError("Event");
    }

    const leads = await this.leadGateway.listByEvent(event.id);

    return leads.map((lead) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email ?? undefined,
      phone: lead.phone ?? undefined,
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
    }));
  }
}
