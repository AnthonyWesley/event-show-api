import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { Event, Goal } from "../../domain/entities/event/Event";
import { IUseCases } from "../IUseCases";
import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { ValidationError } from "../../shared/errors/ValidationError";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ConflictError } from "../../shared/errors/ConflictError";

export type CreatePartnerEventInputDto = {
  name: string;
  // startDate: Date;
  endDate?: Date;
  goal: number;
  goalType: Goal;
  partnerId: string;
};

export type CreatePartnerEventOutputDto = {
  id: string;
};

export class CreatePartnerEvent
  implements IUseCases<CreatePartnerEventInputDto, CreatePartnerEventOutputDto>
{
  private constructor(
    private readonly eventGateway: IEventGateway,
    private readonly partnerGateway: IPartnerGateway
  ) {}

  public static create(
    eventGateway: IEventGateway,
    partnerGateway: IPartnerGateway
  ) {
    return new CreatePartnerEvent(eventGateway, partnerGateway);
  }

  public async execute(
    input: CreatePartnerEventInputDto
  ): Promise<CreatePartnerEventOutputDto> {
    if (!input.name || !input.partnerId) {
      throw new ValidationError(
        "All fields are required: name, startDate, partnerId."
      );
    }
    const partnerExists = await this.partnerGateway.findById(input.partnerId);
    if (!partnerExists) {
      throw new NotFoundError("Partner");
    }

    const lastEvent = await this.eventGateway.findLastEventByPartner(
      input.partnerId
    );

    if (lastEvent && !lastEvent.endDate) {
      throw new ConflictError(
        "Only one event can be active at a time. Wait until the current event ends."
      );
    }
    const anEvent = Event.create(
      input.name,
      // input.startDate,
      // input.endDate,
      input.goal,
      input.goalType,
      partnerExists.id
    );
    await this.eventGateway.save(anEvent);

    return { id: anEvent.id };
  }
}
