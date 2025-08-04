import { IUseCases } from "../IUseCases";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { Seller } from "../../domain/entities/seller/Seller";
import { ValidationError } from "../../shared/errors/ValidationError";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { SocketServer } from "../../infra/socket/SocketServer";
import { ForbiddenError } from "../../shared/errors/ForbiddenError";
import { hasReachedLimit } from "../../shared/utils/hasReachedLimit";

export type CreateSellerInputDto = {
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  companyId: string;
  keys: { limit_seller: number; unlimited_seller: boolean };
  // sales     Sale[]
  // createdAt: Date;
};

export type CreateSellerOutputDto = {
  id: string;
};

export class CreateSeller
  implements IUseCases<CreateSellerInputDto, CreateSellerOutputDto>
{
  private constructor(
    private readonly sellerGateway: ISellerGateway,
    private readonly companyGateway: ICompanyGateway,
    private readonly socketServer: SocketServer
  ) {}

  public static create(
    sellerGateway: ISellerGateway,
    companyGateway: ICompanyGateway,
    socketServer: SocketServer
  ) {
    return new CreateSeller(sellerGateway, companyGateway, socketServer);
  }

  public async execute(
    input: CreateSellerInputDto
  ): Promise<CreateSellerOutputDto> {
    if (!input.name || !input.email || !input.companyId) {
      throw new ValidationError(
        "All fields are required: name, email, companyId."
      );
    }

    const companyExists = await this.companyGateway.findById(input.companyId);
    if (!companyExists) {
      throw new NotFoundError("Company");
    }

    const existingSeller = await this.sellerGateway.findByEmail({
      email: input.email,
      companyId: input.companyId,
    });

    if (existingSeller) {
      throw new ValidationError("A seller with this email already exists.");
    }

    const allSellersCount = await this.sellerGateway.countByCompany(
      input.companyId
    );

    if (!input.keys.unlimited_seller) {
      if (hasReachedLimit(allSellersCount, input.keys.limit_seller)) {
        throw new ForbiddenError(
          "Limite de vendedores atingido pelo seu plano."
        );
      }
    }

    const anEvent = Seller.create(
      input.name,
      input.email,
      companyExists.id,
      input.phone ?? "",
      input.photo ?? ""
    );

    await this.sellerGateway.save(anEvent);
    this.socketServer?.emit("seller:created", { id: input.companyId });

    return { id: anEvent.id };
  }
}
