import { Response, Request } from "express";
import {
  DeleteProduct,
  DeleteProductInputDto,
} from "../../../usecase/product/DeleteProduct";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

export type DeleteProductResponseDto = {
  id: string;
};
export class DeleteProductRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deleteProductService: DeleteProduct,
    private readonly authorization: AuthorizationRoute
  ) {}

  static create(
    deleteProductService: DeleteProduct,
    authorization: AuthorizationRoute
  ) {
    return new DeleteProductRoute(
      "/products/:productId",
      HttpMethod.DELETE,
      deleteProductService,
      authorization
    );
  }
  getHandler() {
    return async (request: Request, response: Response) => {
      const { productId } = request.params;
      const { user } = request as any;

      const input: DeleteProductInputDto = {
        companyId: user.companyId,
        productId,
      };

      await this.deleteProductService.execute(input);

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
    return [this.authorization.userRoute];
  }
}
