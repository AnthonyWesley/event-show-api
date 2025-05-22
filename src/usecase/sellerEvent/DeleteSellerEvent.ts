import { ISellerEventGateway } from "../../domain/entities/sellerEvent/ISellerEventGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ValidationError } from "../../shared/errors/ValidationError";
import { IUseCases } from "../IUseCases";

export type DeleteSellerEventInputDto = {
  sellerId: string;
  eventId: string;
};

export class DeleteSellerEvent
  implements IUseCases<DeleteSellerEventInputDto, void>
{
  private constructor(
    private readonly sellerEventGateway: ISellerEventGateway
  ) {}

  public static create(sellerEventGateway: ISellerEventGateway) {
    return new DeleteSellerEvent(sellerEventGateway);
  }

  public async execute(input: DeleteSellerEventInputDto): Promise<void> {
    if (!input.sellerId || !input.eventId) {
      throw new ValidationError("Seller ID and Event ID are required.");
    }

    const exists = await this.sellerEventGateway.findByEventAndSeller(
      input.sellerId,
      input.eventId
    );

    if (!exists) {
      throw new NotFoundError("SellerEvent relation");
    }

    await this.sellerEventGateway.delete(input.sellerId, input.eventId);
  }
}
