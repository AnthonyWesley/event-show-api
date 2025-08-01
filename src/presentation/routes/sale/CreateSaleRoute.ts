import { Request, Response } from "express";
import {
  CreateSale,
  CreateSaleInputDto,
} from "../../../usecase/sale/CreateSale";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

export type CreateSaleResponseDto = {
  id: string;
};

export class CreateSaleRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createSaleService: CreateSale,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    createSaleService: CreateSale,
    authorization: AuthorizationRoute
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
      const { user } = request as any;

      const { sellerId, productId, quantity, leadId, lead } = request.body;

      const input: CreateSaleInputDto = {
        companyId: user.companyId,
        eventId,
        sellerId,
        productId,
        quantity,
        leadId,
        lead,
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
    return [this.authorization.userRoute];
  }
}
