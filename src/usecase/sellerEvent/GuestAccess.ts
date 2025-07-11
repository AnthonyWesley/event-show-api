import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { IUseCases } from "../IUseCases";
import { Authorization } from "../../infra/http/middlewares/Authorization";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";
import { IEventGateway } from "../../domain/entities/event/IEventGateway";
import { ISellerGateway } from "../../domain/entities/seller/ISellerGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { SaleProps } from "../../domain/entities/sale/Sale";
import { SellerStatsHelper } from "../../helpers/SellerStatsHelper";

export type GuestAccessOutputDto = {
  token: TokenType;
  guest: SellerDto;
};

export type TokenType = {
  accessToken: string;
  // refreshToken: string;
};

export type SellerDto = {
  eventId: string;
  id: string;
  name: string;
  email: string;
  photo: string;
  phone: string;
  sales: SaleProps[];
  totalSalesCount: number;
  totalSalesValue: number;
};

export type GuestAccessInputDto = {
  companyId: string;
  email: string;
  eventId: string;
  sellerId: string;
};

export class GuestAccess
  implements IUseCases<GuestAccessInputDto, GuestAccessOutputDto>
{
  private constructor(
    private readonly companyGateway: ICompanyGateway,
    private readonly eventGateway: IEventGateway,
    private readonly sellerGateway: ISellerGateway,
    private readonly authorization: Authorization
  ) {}

  static create(
    companyGateway: ICompanyGateway,
    eventGateway: IEventGateway,
    sellerGateway: ISellerGateway,
    authorization: Authorization
  ) {
    return new GuestAccess(
      companyGateway,
      eventGateway,
      sellerGateway,
      authorization
    );
  }

  async execute(input: GuestAccessInputDto): Promise<GuestAccessOutputDto> {
    const company = await this.companyGateway.findById(input.companyId);
    if (!company) {
      throw new UnauthorizedError("Invalid email.");
    }

    const event = await this.eventGateway.findById({
      companyId: input.companyId,
      eventId: input.eventId,
    });
    if (!event) {
      throw new NotFoundError("Seller");
    }

    const seller = await this.sellerGateway.findById({
      sellerId: input.sellerId,
      companyId: input.companyId,
    });
    if (!seller) {
      throw new NotFoundError("Seller");
    }

    const filteredSales = (seller.sales ?? []).filter(
      (sale) => sale.eventId === input.eventId
    );

    const stats = SellerStatsHelper.computeStats(
      filteredSales,
      company.products ?? []
    );

    const { count: totalSalesCount, total: totalSalesValue } = stats[
      seller.id
    ] ?? { count: 0, total: 0 };

    const accessToken = this.authorization.generateToken(
      {
        id: company.users && company?.users[0].id,
        email: company.users && company?.users[0].email,
        companyId: company.id,
      },
      "1d"
    );

    return {
      token: { accessToken },

      guest: {
        eventId: event.id,
        id: seller.id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone ?? "",
        photo: seller.photo ?? "",
        sales: filteredSales ?? [],
        totalSalesCount,
        totalSalesValue,
      },
    };
  }
}
