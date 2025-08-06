import { GoalMode, GoalType } from "@prisma/client";
import { Goal } from "../../domain/entities/event/Event";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { SocketServer } from "../../infra/socket/SocketServer";
import { UpdateSellersGoalService } from "./UpdateSellersGoalService";

export type UpdateEventInputDto = {
  companyId: string;
  eventId: string;
  name?: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date | null;
  goal?: number;
  goalType?: Goal;
  goalMode?: GoalMode;
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
  goalMode?: GoalMode;

  goalType: Goal;
  companyId: string;
};

export class UpdateEvent {
  constructor(
    private readonly eventGateway: IEventGateway,
    private readonly companyGateway: ICompanyGateway,
    private readonly socketServer?: SocketServer,
    private readonly updateSellersGoalService?: UpdateSellersGoalService
  ) {}

  static create(
    eventGateway: IEventGateway,
    companyGateway: ICompanyGateway,
    socketServer?: SocketServer,
    updateSellersGoalService?: UpdateSellersGoalService
  ) {
    return new UpdateEvent(
      eventGateway,
      companyGateway,
      socketServer,
      updateSellersGoalService
    );
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

    if (existingEvent.goal !== updatedEvent.goal) {
      await this.updateSellersGoalService?.execute(updatedEvent);
    }

    this.socketServer?.emit("event:updated", {
      id: updatedEvent.id,
      name: updatedEvent.name,
      startDate: updatedEvent.startDate,
      endDate: updatedEvent.endDate ?? null,
      isActive: updatedEvent.isActive,
      goalMode: updatedEvent.goalMode,
      goal: updatedEvent.goal,
      goalType: updatedEvent.goalType as GoalType,
      companyId: updatedEvent.companyId,
    });

    return {
      id: updatedEvent.id,
      name: updatedEvent.name,
      startDate: updatedEvent.startDate,
      endDate: updatedEvent.endDate ?? null,
      isActive: updatedEvent.isActive,
      goalMode: updatedEvent.goalMode,
      goal: updatedEvent.goal,
      goalType: updatedEvent.goalType as GoalType,
      companyId: updatedEvent.companyId,
    };
  }
}
