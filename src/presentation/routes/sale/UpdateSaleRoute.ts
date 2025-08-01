import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import {
  UpdateSale,
  UpdateSaleInputDto,
} from "../../../usecase/sale/UpdateSale";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

export class UpdateSaleRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateSaleService: UpdateSale,
    private readonly authorization: AuthorizationRoute
  ) {}

  static create(
    updateSaleService: UpdateSale,
    authorization: AuthorizationRoute
  ) {
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
      const { user } = request as any;
      const { quantity } = request.body;

      const input: UpdateSaleInputDto = {
        saleId,
        eventId,
        companyId: user.companyId,
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
    return [this.authorization.userRoute];
  }
}
