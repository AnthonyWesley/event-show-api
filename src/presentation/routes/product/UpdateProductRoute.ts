import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import {
  UpdateProduct,
  UpdateProductInputDto,
} from "../../../usecase/product/UpdateProduct";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

export class UpdateProductRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateProductService: UpdateProduct,
    private readonly authorization: AuthorizationRoute
  ) {}

  static create(
    updateProductService: UpdateProduct,
    authorization: AuthorizationRoute
  ) {
    return new UpdateProductRoute(
      "/products/:productId",
      HttpMethod.PATCH,
      updateProductService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response) => {
      const { productId } = request.params;
      const { user } = request as any;

      const { name, price } = request.body;

      const input: UpdateProductInputDto = {
        companyId: user.companyId,
        productId,
        name,
        price,
      };

      const result = await this.updateProductService.execute(input);

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
