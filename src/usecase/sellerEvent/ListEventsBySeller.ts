import { IUseCases } from "../IUseCases";
import { ISellerEventGateway } from "../../domain/entities/sellerEvent/ISellerEventGateway";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { SellerStatsHelper } from "../../helpers/SellerStatsHelper";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { EventProps } from "../../domain/entities/event/Event";
import { GoalType } from "@prisma/client";
import { SellerEventProps } from "../../domain/entities/sellerEvent/SellerEvent";
export type ListEventsBySellerInputDto = {
  sellerId: string;
  // eventId: string;
  partnerId: string;
};

export type ListEventsBySellerOutputDto = {
  events: {
    id: string;
    name: string;
    startDate: Date;
    endDate?: Date;
    // sellerEvents: SellerEventProps[];
    // sales: SaleProps[];
    goal: number;
    goalType: GoalType;
    // partnerId: string;
    createdAt: Date;
  }[];
};

export class ListEventsBySeller
  implements IUseCases<ListEventsBySellerInputDto, ListEventsBySellerOutputDto>
{
  private constructor(
    private readonly sellerEventGateway: ISellerEventGateway,
    private readonly partnerGateway: IPartnerGateway,
    private readonly eventGateway: IEventGateway
  ) {}

  public static create(
    sellerEventGateway: ISellerEventGateway,
    partnerGateway: IPartnerGateway,
    eventGateway: IEventGateway
  ) {
    return new ListEventsBySeller(
      sellerEventGateway,
      partnerGateway,
      eventGateway
    );
  }

  public async execute(
    input: ListEventsBySellerInputDto
  ): Promise<ListEventsBySellerOutputDto> {
    const [events, partner] = await Promise.all([
      this.sellerEventGateway.listEventsBySeller(input.sellerId),
      this.partnerGateway.findById(input.partnerId),
    ]);

    if (!events) throw new NotFoundError("Events");
    if (!partner) throw new NotFoundError("Partner");

    return {
      events: events.map((event) => ({
        id: event.id,
        name: event.name,
        startDate: event.startDate,
        endDate: event.endDate ?? undefined,
        goal: event.goal,
        goalType: event.goalType as GoalType,
        createdAt: event.createdAt,
      })),
    };
  }
}
