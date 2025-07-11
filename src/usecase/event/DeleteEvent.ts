import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type DeleteEventInputDto = {
  companyId: string;
  eventId: string;
};

export class DeleteEvent implements IUseCases<DeleteEventInputDto, void> {
  private constructor(
    readonly eventGateway: IEventGateway,
    readonly companyGateway: ICompanyGateway
  ) {}

  static create(eventGateway: IEventGateway, companyGateway: ICompanyGateway) {
    return new DeleteEvent(eventGateway, companyGateway);
  }

  async execute(input: DeleteEventInputDto): Promise<void> {
    const companyExists = await this.companyGateway.findById(input.companyId);

    if (!companyExists) {
      throw new NotFoundError("Company");
    }
    await this.eventGateway.delete(input);
  }
}
