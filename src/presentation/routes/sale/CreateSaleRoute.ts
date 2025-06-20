import { Request, Response } from "express";
import {
  CreateSale,
  CreateSaleInputDto,
} from "../../../usecase/sale/CreateSale";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export type CreateSaleResponseDto = {
  id: string;
};

export class CreateSaleRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createSaleService: CreateSale,
    private readonly authorization: Authorization
  ) {}

  public static create(
    createSaleService: CreateSale,
    authorization: Authorization
  ) {
    return new CreateSaleRoute(
      "/events/:eventId/sales",
      HttpMethod.POST,
      createSaleService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { eventId } = request.params;
      const { partner } = request as any;

      const { sellerId, productId, quantity } = request.body;

      const input: CreateSaleInputDto = {
        partnerId: partner.id,
        eventId,
        sellerId,
        productId,
        quantity,
        // total,
      };

      const output = await this.createSaleService.execute(input);
      response.status(201).json({ id: output.id });
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
