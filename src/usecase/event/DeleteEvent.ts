import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { ISocketServer } from "../../infra/socket/ISocketServer";
import { SocketServer } from "../../infra/socket/SocketServer";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type DeleteEventInputDto = {
  companyId: string;
  eventId: string;
};

export class DeleteEvent implements IUseCases<DeleteEventInputDto, void> {
  private constructor(
    readonly eventGateway: IEventGateway,
    readonly companyGateway: ICompanyGateway,
    readonly socketServer?: ISocketServer
  ) {}

  static create(
    eventGateway: IEventGateway,
    companyGateway: ICompanyGateway,
    socketServer?: ISocketServer
  ) {
    return new DeleteEvent(eventGateway, companyGateway, socketServer);
  }

  async execute(input: DeleteEventInputDto): Promise<void> {
    const companyExists = await this.companyGateway.findById(input.companyId);

    if (!companyExists) {
      throw new NotFoundError("Company");
    }
    const anDeletedEvent = await this.eventGateway.delete(input);
    this.socketServer?.emit("event:deleted", anDeletedEvent);
  }
}
