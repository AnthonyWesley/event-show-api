import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { Authorization } from "../../../infra/http/middlewares/Authorization";
import {
  FindEventSeller,
  FindEventSellerOutputDto,
} from "../../../usecase/seller/FindEventSeller";
import { SaleProps } from "../../../domain/entities/sale/Sale";

export type FindEventSellerResponseDto = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  partnerId: string;
  sales: SaleProps[];
  createdAt: Date;
};

export class FindEventSellerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findEventSellerServer: FindEventSeller,
    private readonly authorization: Authorization
  ) {}

  public static create(
    findEventSellerServer: FindEventSeller,
    authorization: Authorization
  ) {
    return new FindEventSellerRoute(
      "/sellers/:sellerId",
      HttpMethod.GET,
      findEventSellerServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { sellerId } = request.params;
      const { partner } = request as any;

      const input = { partnerId: partner.id, sellerId };

      const output: FindEventSellerOutputDto =
        await this.findEventSellerServer.execute(input);

      const result = {
        id: output.id,
        name: output.name,
        email: output.email,
        phone: output.phone,
        photo: output.photo,
        partnerId: output.partnerId,
        sales: output.sales,
        createdAt: output.createdAt,
      };
      response.status(200).json(result);
    };
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }

  public getMiddlewares() {
    return [this.authorization.authorizationRoute];
  }
}
