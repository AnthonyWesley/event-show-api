import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { Authorization } from "../../../infra/http/middlewares/Authorization";
import {
  FindPartnerProduct,
  FindPartnerProductInputDto,
  FindPartnerProductOutputDto,
} from "../../../usecase/product/FindPartnerProduct";

export type FindPartnerProductResponseDto = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  partnerId: string;
  createdAt: Date;
};

export class FindPartnerProductRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly FindPartnerProductServer: FindPartnerProduct,
    private readonly authorization: Authorization
  ) {}

  public static create(
    FindPartnerProductServer: FindPartnerProduct,
    authorization: Authorization
  ) {
    return new FindPartnerProductRoute(
      "/products/:productId",
      HttpMethod.GET,
      FindPartnerProductServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { productId } = request.params;
      const { partner } = request as any;

      const input: FindPartnerProductInputDto = {
        partnerId: partner.id,
        productId,
      };
      const output: FindPartnerProductOutputDto =
        await this.FindPartnerProductServer.execute(input);

      const result = {
        id: output.id,
        name: output.name,
        price: output.price,
        partnerId: output.partnerId,
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
    return this.authorization.authorizationRoute;
  }
}
