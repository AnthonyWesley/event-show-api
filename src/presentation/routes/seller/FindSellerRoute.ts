import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { Authorization } from "../../../infra/http/middlewares/Authorization";

import { SaleProps } from "../../../domain/entities/sale/Sale";
import {
  FindSeller,
  FindSellerOutputDto,
} from "../../../usecase/seller/FindSeller";

export type FindSellerResponseDto = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  companyId: string;
  sales: SaleProps[];
  createdAt: Date;
};

export class FindSellerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findSellerServer: FindSeller,
    private readonly authorization: Authorization
  ) {}

  public static create(
    findSellerServer: FindSeller,
    authorization: Authorization
  ) {
    return new FindSellerRoute(
      "/sellers/:sellerId",
      HttpMethod.GET,
      findSellerServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { sellerId } = request.params;
      const { user } = request as any;

      const input = { companyId: user.companyId, sellerId };

      const output: FindSellerOutputDto = await this.findSellerServer.execute(
        input
      );

      const result = {
        id: output.id,
        name: output.name,
        email: output.email,
        phone: output.phone,
        photo: output.photo,
        companyId: output.companyId,
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
