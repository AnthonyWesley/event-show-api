import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { ILeadGateway } from "../../domain/entities/lead/ILeadGateway";
import { Lead } from "../../domain/entities/lead/Lead";

import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ValidationError } from "../../shared/errors/ValidationError";
import { IUseCases } from "../IUseCases";

export type CreateLeadInputDto = {
  name: string;
  email?: string;
  phone?: string;
  products: { id: string }[];

  customInterest?: string;
  notes?: string;
  source: string;
  eventId: string;
  companyId: string;
};

export type CreateLeadOutputDto = {
  id: string;
};

export class CreateLead
  implements IUseCases<CreateLeadInputDto, CreateLeadOutputDto>
{
  private constructor(
    private readonly leadGateway: ILeadGateway,
    private readonly eventGateway: IEventGateway
  ) {}

  public static create(leadGateway: ILeadGateway, eventGateway: IEventGateway) {
    return new CreateLead(leadGateway, eventGateway);
  }

  public async execute(
    input: CreateLeadInputDto
  ): Promise<CreateLeadOutputDto> {
    if (!input.name || !input.source || !input.eventId || !input.companyId) {
      throw new ValidationError("Missing required fields.");
    }

    const event = await this.eventGateway.findById({
      eventId: input.eventId,
      companyId: input.companyId,
    });
    if (!event) {
      throw new NotFoundError("Event");
    }

    const lead = Lead.create(
      input.name,
      input.products,
      input.source,
      input.eventId,
      input.companyId,
      input.email,
      input.phone,
      input.notes,
      input.customInterest
    );

    await this.leadGateway.save(lead);

    return { id: lead.id };
  }
}
