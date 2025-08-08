import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { Goal } from "../../domain/entities/event/Event";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { ConflictError } from "../../shared/errors/ConflictError";
import { ForbiddenError } from "../../shared/errors/ForbiddenError";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { hasReachedLimit } from "../../shared/utils/hasReachedLimit";

export type SwitchEventStateInputDto = {
  companyId: string;
  eventId: string;
  name?: string;
  startDate?: Date;
  endDate?: Date | null;
  goal?: number;
  goalType?: Goal;
  eventLimit: number;
};

export type SwitchEventStateResponseDto = {
  id: string;
  isActive?: boolean;
  companyId: string;
};

export class SwitchEventState {
  constructor(
    private readonly eventGateway: IEventGateway,
    private readonly companyGateway: ICompanyGateway
  ) {}

  static create(eventGateway: IEventGateway, companyGateway: ICompanyGateway) {
    return new SwitchEventState(eventGateway, companyGateway);
  }

  async execute(
    input: SwitchEventStateInputDto
  ): Promise<SwitchEventStateResponseDto> {
    const companyExists = await this.companyGateway.findById(input.companyId);
    if (!companyExists) {
      throw new NotFoundError("Company");
    }

    const existingEvent = await this.eventGateway.findById(input);
    if (!existingEvent) {
      throw new NotFoundError("Event");
    }
    const toggledIsActive = !existingEvent.isActive;

    if (toggledIsActive) {
      const activeEvents = await this.eventGateway.findActiveByCompanyId({
        eventId: input.eventId,
        companyId: input.companyId,
      });

      const allEventsCount = await this.eventGateway.countActiveByCompany(
        input.companyId
      );

      if (hasReachedLimit(allEventsCount, input.eventLimit)) {
        throw new ForbiddenError(
          "Limite de eventos ativos atingido pelo seu plano."
        );
      }
    }

    const updatedEvent = await this.eventGateway.update({
      ...input,
      isActive: toggledIsActive,
      endDate: toggledIsActive ? null : new Date(),
    });

    return {
      id: updatedEvent.id,
      isActive: updatedEvent.isActive,
      companyId: updatedEvent.companyId,
    };
  }
}
