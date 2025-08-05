import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { Event, Goal } from "../../domain/entities/event/Event";
import { IUseCases } from "../IUseCases";
import { ValidationError } from "../../shared/errors/ValidationError";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { SocketServer } from "../../infra/socket/SocketServer";
import { GoalMode } from "@prisma/client";

export type CreateEventInputDto = {
  name: string;
  endDate?: Date;
  photo?: string;
  goalMode: GoalMode;
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
    private readonly companyGateway: ICompanyGateway,
    private readonly socketServer?: SocketServer
  ) {}

  public static create(
    eventGateway: IEventGateway,
    companyGateway: ICompanyGateway,
    socketServer?: SocketServer
  ) {
    return new CreateEvent(eventGateway, companyGateway, socketServer);
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

    const anEvent = Event.create({
      name: input.name,
      goal: input.goal,
      goalType: input.goalType,
      companyId: companyExists.id,
      goalMode: input.goalMode ?? "auto",
    });
    await this.eventGateway.save(anEvent);
    this.socketServer?.emit("event:created", anEvent);

    return { id: anEvent.id };
  }
}
