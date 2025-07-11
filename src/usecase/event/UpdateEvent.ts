import { GoalType } from "@prisma/client";
import { Goal } from "../../domain/entities/event/Event";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";

export type UpdateEventInputDto = {
  companyId: string;
  eventId: string;
  name?: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date | null;
  goal?: number;
  goalType?: Goal;
  photo?: string;
  photoPublicId?: string;
  file?: any;
};

export type UpdateEventResponseDto = {
  id: string;
  name: string;
  startDate: Date;
  isActive?: boolean;
  endDate: Date | null;
  goal: number;
  goalType: Goal;
  companyId: string;
};

export class UpdateEvent {
  constructor(
    private readonly eventGateway: IEventGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  static create(eventGateway: IEventGateway, companyGateway: ICompanyGateway) {
    return new UpdateEvent(eventGateway, companyGateway);
  }

  async execute(input: UpdateEventInputDto): Promise<UpdateEventResponseDto> {
    const companyExists = await this.companyGateway.findById(input.companyId);
    if (!companyExists) {
      throw new NotFoundError("Company");
    }

    const existingEvent = await this.eventGateway.findById(input);
    if (!existingEvent) {
      throw new NotFoundError("Event");
    }

    const updatedEvent = await this.eventGateway.update(input);
    if (!updatedEvent) {
      throw new Error("Failed to update event.");
    }

    return {
      id: updatedEvent.id,
      name: updatedEvent.name,
      startDate: updatedEvent.startDate,
      endDate: updatedEvent.endDate ?? null,
      isActive: updatedEvent.isActive,
      goal: updatedEvent.goal,
      goalType: updatedEvent.goalType as GoalType,
      companyId: updatedEvent.companyId,
    };
  }
}
