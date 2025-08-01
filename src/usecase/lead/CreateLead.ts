import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { ILeadGateway } from "../../domain/entities/lead/ILeadGateway";
import { Lead } from "../../domain/entities/lead/Lead";
import { ILeadSourceGateway } from "../../domain/entities/leadSource/ILeadSourceGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ValidationError } from "../../shared/errors/ValidationError";
import { IUseCases } from "../IUseCases";

export type CreateLeadInputDto = {
  leadSourceId: string | undefined;
  sellerId?: string | undefined;
  name: string;
  email?: string;
  phone?: string;
  products: { id: string; name: string }[];

  customInterest?: string;
  notes?: string;
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
    private readonly eventGateway: IEventGateway,
    private readonly leadSourceGateway: ILeadSourceGateway
  ) {}

  public static create(
    leadGateway: ILeadGateway,
    eventGateway: IEventGateway,
    leadSourceGateway: ILeadSourceGateway
  ) {
    return new CreateLead(leadGateway, eventGateway, leadSourceGateway);
  }

  public async execute(
    input: CreateLeadInputDto
  ): Promise<CreateLeadOutputDto> {
    const hasLeadSource =
      !!input.leadSourceId && input.leadSourceId.trim() !== "";
    const hasSeller = !!input.sellerId && input.sellerId.trim() !== "";

    if ((hasLeadSource && hasSeller) || (!hasLeadSource && !hasSeller)) {
      throw new ValidationError(
        "You must provide **only one**: either leadSourceId or sellerId, never both."
      );
    }

    const event = await this.eventGateway.findById({
      eventId: input.eventId,
      companyId: input.companyId,
    });
    if (!event) {
      throw new NotFoundError("Event");
    }

    const lead = Lead.create({
      name: input.name,
      products: input.products,
      eventId: input.eventId,
      companyId: input.companyId,
      leadSourceId: hasLeadSource ? input.leadSourceId : undefined,
      sellerId: hasSeller ? input.sellerId : undefined,
      email: input.email,
      phone: input.phone,
      notes: input.notes,
      customInterest: input.customInterest,
    });

    await this.leadGateway.save(lead);

    return { id: lead.id };
  }
}
