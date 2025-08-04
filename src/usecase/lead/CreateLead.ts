import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { ILeadGateway } from "../../domain/entities/lead/ILeadGateway";
import { Lead, LeadStatus } from "../../domain/entities/lead/Lead";
import { ILeadSourceGateway } from "../../domain/entities/leadSource/ILeadSourceGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ValidationError } from "../../shared/errors/ValidationError";
import { IUseCases } from "../IUseCases";
import {
  UpsertLeadCustomValueInputDto,
  UpsertLeadCustomValues,
} from "../LeadCustomValues/UpsertLeadCustomValues";

export type CreateLeadInputDto = {
  leadSourceId: string | undefined;
  sellerId?: string | undefined;
  name: string;
  phone: string;
  products: { id: string; name: string }[];
  customInterest?: string;
  notes?: string;
  eventId: string;
  companyId: string;
  customValues: UpsertLeadCustomValueInputDto[];
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
    private readonly leadSourceGateway: ILeadSourceGateway,
    private readonly upsertLeadCustomValues: UpsertLeadCustomValues
  ) {}

  public static create(
    leadGateway: ILeadGateway,
    eventGateway: IEventGateway,
    leadSourceGateway: ILeadSourceGateway,
    upsertLeadCustomValues: UpsertLeadCustomValues
  ) {
    return new CreateLead(
      leadGateway,
      eventGateway,
      leadSourceGateway,
      upsertLeadCustomValues
    );
  }

  public async execute(
    input: CreateLeadInputDto
  ): Promise<CreateLeadOutputDto> {
    const hasLeadSource = !!input.leadSourceId?.trim();
    const hasSeller = !!input.sellerId?.trim();

    if ((hasLeadSource && hasSeller) || (!hasLeadSource && !hasSeller)) {
      throw new ValidationError(
        "You must provide **only one**: either leadSourceId or sellerId, never both."
      );
    }

    const event = await this.eventGateway.findById({
      eventId: input.eventId,
      companyId: input.companyId,
    });

    if (!event) throw new NotFoundError("Event");

    const lead = Lead.create({
      name: input.name,
      phone: input.phone,
      products: input.products,
      eventId: input.eventId,
      companyId: input.companyId,
      leadSourceId: hasLeadSource ? input.leadSourceId : undefined,
      sellerId: hasSeller ? input.sellerId : undefined,
      notes: input.notes,
      // customInterest: input.customInterest,
      status: LeadStatus.NEW,
      wasPresent: false,
      sales: [],
    });

    await this.leadGateway.save(lead);
    // input.customValues.forEach((v) => {
    //   v.leadId = lead.id;
    // });
    // await this.upsertLeadCustomValues.execute(input.customValues);

    return { id: lead.id };
  }
}
