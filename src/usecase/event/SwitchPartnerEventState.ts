import { Goal } from "../../domain/entities/event/Event";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { ConflictError } from "../../shared/errors/ConflictError";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export type SwitchPartnerEventStateInputDto = {
  partnerId: string;
  eventId: string;
  name?: string;
  startDate?: Date;
  endDate?: Date | null;
  goal?: number;
  goalType?: Goal;
};

export type SwitchPartnerEventStateResponseDto = {
  id: string;
  isActive?: boolean;
  partnerId: string;
};

export class SwitchPartnerEventState {
  constructor(
    private readonly eventGateway: IEventGateway,
    private readonly partnerGateway: IPartnerGateway
  ) {}

  static create(eventGateway: IEventGateway, partnerGateway: IPartnerGateway) {
    return new SwitchPartnerEventState(eventGateway, partnerGateway);
  }

  async execute(
    input: SwitchPartnerEventStateInputDto
  ): Promise<SwitchPartnerEventStateResponseDto> {
    const partnerExists = await this.partnerGateway.findById(input.partnerId);
    if (!partnerExists) {
      throw new NotFoundError("Partner");
    }

    const existingEvent = await this.eventGateway.findById(input);
    if (!existingEvent) {
      throw new NotFoundError("Event");
    }
    const toggledIsActive = !existingEvent.isActive;

    if (toggledIsActive) {
      const activeEvents = await this.eventGateway.findActiveByPartnerId({
        eventId: input.eventId,
        partnerId: input.partnerId,
      });

      console.log(activeEvents);

      if (activeEvents.length >= partnerExists.maxConcurrentEvents) {
        throw new ConflictError(
          "Maximum number of active events reached for this partner."
        );
      }
    }

    const updatedEvent = await this.eventGateway.update({
      ...input,
      isActive: toggledIsActive,
      endDate: toggledIsActive ? null : new Date(), // ativar => null, desativar => new Date()
    });

    return {
      id: updatedEvent.id,
      isActive: updatedEvent.isActive,
      partnerId: updatedEvent.partnerId,
    };
  }
}
