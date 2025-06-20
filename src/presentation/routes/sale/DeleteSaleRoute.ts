import { Response, Request } from "express";

import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";
import {
  DeleteSale,
  DeleteSaleInputDto,
} from "../../../usecase/sale/DeleteSale";

export type DeleteRouteResponseDto = {
  id: string;
};
export class DeleteSaleRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deleteSaleService: DeleteSale,
    private readonly authorization: Authorization
  ) {}

  static create(deleteSaleService: DeleteSale, authorization: Authorization) {
    return new DeleteSaleRoute(
      "/events/:eventId/sales/:saleId",
      HttpMethod.DELETE,
      deleteSaleService,
      authorization
    );
  }
  getHandler() {
    return async (request: Request, response: Response) => {
      const { eventId, saleId } = request.params;
      const { partner } = request as any;

      const input: DeleteSaleInputDto = {
        partnerId: partner.id,
        eventId,
        saleId,
      };

      await this.deleteSaleService.execute(input);

      response.status(201).json();
    };
  }

  getPath(): string {
    return this.path;
  }

  getMethod(): HttpMethod {
    return this.method;
  }

  public getMiddlewares() {
    return [this.authorization.authorizationRoute];
  }
}
