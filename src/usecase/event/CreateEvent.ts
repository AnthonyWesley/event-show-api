import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { Event, Goal } from "../../domain/entities/event/Event";
import { IUseCases } from "../IUseCases";
import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { ValidationError } from "../../shared/errors/ValidationError";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export type CreateEventInputDto = {
  name: string;
  endDate?: Date;
  photo?: string;
  goal: number;
  goalType: Goal;
  partnerId: string;
};

export type CreateEventOutputDto = {
  id: string;
};

export class CreateEvent
  implements IUseCases<CreateEventInputDto, CreateEventOutputDto>
{
  private constructor(
    private readonly eventGateway: IEventGateway,
    private readonly partnerGateway: IPartnerGateway
  ) {}

  public static create(
    eventGateway: IEventGateway,
    partnerGateway: IPartnerGateway
  ) {
    return new CreateEvent(eventGateway, partnerGateway);
  }

  public async execute(
    input: CreateEventInputDto
  ): Promise<CreateEventOutputDto> {
    if (!input.name || !input.partnerId) {
      throw new ValidationError(
        "All fields are required: name, startDate, partnerId."
      );
    }
    const partnerExists = await this.partnerGateway.findById(input.partnerId);
    if (!partnerExists) {
      throw new NotFoundError("Partner");
    }

    const anEvent = Event.create(
      input.name,
      input.goal,
      input.goalType,
      partnerExists.id,
      input.photo ?? ""
    );
    await this.eventGateway.save(anEvent);

    return { id: anEvent.id };
  }
}
