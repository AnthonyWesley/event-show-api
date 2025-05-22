import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import {
  ListPartnerProduct,
  ListPartnerProductOutputDto,
} from "../../../usecase/product/ListPartnerProduct";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export type ListPartnerProductResponseDto = {
  products: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    partnerId: string;
    createdAt: Date;
  }[];
};

export class ListPartnerProductRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listPartnerProductServer: ListPartnerProduct,
    private readonly authorization: Authorization
  ) {}

  public static create(
    listPartnerProductServer: ListPartnerProduct,
    authorization: Authorization
  ) {
    return new ListPartnerProductRoute(
      "/products",
      HttpMethod.GET,
      listPartnerProductServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { partner } = request as any;

      const output: ListPartnerProductOutputDto =
        await this.listPartnerProductServer.execute({ partnerId: partner.id });

      const result = {
        products: output.products.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          partnerId: product.partnerId,
          createdAt: product.createdAt,
        })),
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
