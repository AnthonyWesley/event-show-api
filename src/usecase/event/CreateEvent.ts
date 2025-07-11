import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { Event, Goal } from "../../domain/entities/event/Event";
import { IUseCases } from "../IUseCases";
import { ValidationError } from "../../shared/errors/ValidationError";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";

export type CreateEventInputDto = {
  name: string;
  endDate?: Date;
  photo?: string;
  goal: number;
  goalType: Goal;
  companyId: string;
};

export type CreateEventOutputDto = {
  id: string;
};

export class CreateEvent
  implements IUseCases<CreateEventInputDto, CreateEventOutputDto>
{
  private constructor(
    private readonly eventGateway: IEventGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  public static create(
    eventGateway: IEventGateway,
    companyGateway: ICompanyGateway
  ) {
    return new CreateEvent(eventGateway, companyGateway);
  }

  public async execute(
    input: CreateEventInputDto
  ): Promise<CreateEventOutputDto> {
    if (!input.name || !input.companyId) {
      throw new ValidationError(
        "All fields are required: name, startDate, companyId."
      );
    }
    const companyExists = await this.companyGateway.findById(input.companyId);
    if (!companyExists) {
      throw new NotFoundError("Company");
    }

    const anEvent = Event.create(
      input.name,
      input.goal,
      input.goalType,
      companyExists.id,
      input.photo ?? ""
    );
    await this.eventGateway.save(anEvent);

    return { id: anEvent.id };
  }
}
