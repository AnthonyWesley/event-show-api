import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type DeletePartnerEventInputDto = {
  partnerId: string;
  eventId: string;
};

export class DeletePartnerEvent
  implements IUseCases<DeletePartnerEventInputDto, void>
{
  private constructor(
    readonly eventGateway: IEventGateway,
    readonly partnerGateway: IPartnerGateway
  ) {}

  static create(eventGateway: IEventGateway, partnerGateway: IPartnerGateway) {
    return new DeletePartnerEvent(eventGateway, partnerGateway);
  }

  async execute(input: DeletePartnerEventInputDto): Promise<void> {
    const partnerExists = await this.partnerGateway.findById(input.partnerId);

    if (!partnerExists) {
      throw new NotFoundError("Partner");
    }
    await this.eventGateway.delete(input);
  }
}
