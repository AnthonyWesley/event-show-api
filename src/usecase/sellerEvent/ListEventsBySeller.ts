import { IUseCases } from "../IUseCases";
import { ISellerEventGateway } from "../../domain/entities/sellerEvent/ISellerEventGateway";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { GoalType } from "@prisma/client";
export type ListEventsBySellerInputDto = {
  sellerId: string;
  // eventId: string;
  companyId: string;
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
    // companyId: string;
    createdAt: Date;
  }[];
};

export class ListEventsBySeller
  implements IUseCases<ListEventsBySellerInputDto, ListEventsBySellerOutputDto>
{
  private constructor(
    private readonly sellerEventGateway: ISellerEventGateway,
    private readonly companyGateway: ICompanyGateway,
    private readonly eventGateway: IEventGateway
  ) {}

  public static create(
    sellerEventGateway: ISellerEventGateway,
    companyGateway: ICompanyGateway,
    eventGateway: IEventGateway
  ) {
    return new ListEventsBySeller(
      sellerEventGateway,
      companyGateway,
      eventGateway
    );
  }

  public async execute(
    input: ListEventsBySellerInputDto
  ): Promise<ListEventsBySellerOutputDto> {
    const [events, company] = await Promise.all([
      this.sellerEventGateway.listEventsBySeller(input.sellerId),
      this.companyGateway.findById(input.companyId),
    ]);

    if (!events) throw new NotFoundError("Events");
    if (!company) throw new NotFoundError("Company");

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
