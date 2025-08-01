import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import {
  FindProduct,
  FindProductInputDto,
  FindProductOutputDto,
} from "../../../usecase/product/FindProduct";

export type FindProductResponseDto = {
  id: string;
  name: string;
  photo: string;
  photoPublicId: string;
  startDate: Date;
  endDate: Date;
  companyId: string;
  createdAt: Date;
};

export class FindProductRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly FindProductServer: FindProduct,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    FindProductServer: FindProduct,
    authorization: AuthorizationRoute
  ) {
    return new FindProductRoute(
      "/products/:productId",
      HttpMethod.GET,
      FindProductServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { productId } = request.params;
      const { user } = request as any;

      const input: FindProductInputDto = {
        companyId: user.companyId,
        productId,
      };
      const output: FindProductOutputDto = await this.FindProductServer.execute(
        input
      );

      const result = {
        id: output.id,
        name: output.name,
        price: output.price,
        photo: output.photo ?? "",
        photoPublicId: output.photoPublicId ?? "",
        companyId: output.companyId,
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
    return [this.authorization.userRoute];
  }
}
