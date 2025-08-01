import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { SocketServer } from "../../infra/socket/SocketServer";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type DeleteSellerInputDto = {
  companyId: string;
  sellerId: string;
};

export class DeleteSeller implements IUseCases<DeleteSellerInputDto, void> {
  private constructor(
    private readonly sellerGateway: ISellerGateway,
    private readonly companyGateway: ICompanyGateway,
    private readonly socketServer: SocketServer
  ) {}

  static create(
    sellerGateway: ISellerGateway,
    companyGateway: ICompanyGateway,
    socketServer: SocketServer
  ) {
    return new DeleteSeller(sellerGateway, companyGateway, socketServer);
  }

  async execute(input: DeleteSellerInputDto): Promise<void> {
    const companyExists = await this.companyGateway.findById(input.companyId);

    if (!companyExists) {
      throw new NotFoundError("Company not found.");
    }

    await this.sellerGateway.delete(input);
    this.socketServer?.emit("seller:deleted", { id: input.companyId });
  }
}
