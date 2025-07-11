import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { Authorization } from "../../../infra/http/middlewares/Authorization";
import { FindSale, FindSaleInputDto } from "../../../usecase/sale/FindSale";

export type FindSaleRouteResponseDto = {
  id: string;
  eventId: string;
  productId: string;
  sellerId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
  seller: {
    id: string;
    name: string;
  };
  createdAt: Date;
};

export class FindSaleRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findSaleServer: FindSale,
    private readonly authorization: Authorization
  ) {}

  public static create(findSaleServer: FindSale, authorization: Authorization) {
    return new FindSaleRoute(
      "/events/:eventId/sales/:saleId",
      HttpMethod.GET,
      findSaleServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { eventId, saleId } = request.params;
      const { user } = request as any;

      const input: FindSaleInputDto = {
        companyId: user.companyId,
        eventId,

        saleId,
      };
      const output: FindSaleRouteResponseDto =
        await this.findSaleServer.execute(input);

      const result = {
        id: output.id,
        quantity: output.quantity,
        productId: output.productId,
        eventId: output.eventId,
        sellerId: output.sellerId,
        seller: output.seller,
        product: output.product,
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
