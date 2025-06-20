import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import {
  UpdateSale,
  UpdateSaleInputDto,
} from "../../../usecase/sale/UpdateSale";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export class UpdateSaleRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateSaleService: UpdateSale,
    private readonly authorization: Authorization
  ) {}

  static create(updateSaleService: UpdateSale, authorization: Authorization) {
    return new UpdateSaleRoute(
      "/events/:eventId/sales/:saleId",
      HttpMethod.PATCH,
      updateSaleService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response) => {
      const { eventId, saleId } = request.params;
      const { partner } = request as any;
      const { quantity } = request.body;

      const input: UpdateSaleInputDto = {
        saleId,
        eventId,
        partnerId: partner.id,
        quantity,
        // total,
      };

      const result = await this.updateSaleService.execute(input);

      response.status(200).json(result);
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
