import { Response, Request } from "express";
import {
  DeletePartnerProduct,
  DeletePartnerProductInputDto,
} from "../../../usecase/product/DeletePartnerProduct";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export type DeletePartnerProductResponseDto = {
  id: string;
};
export class DeletePartnerProductRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deletePartnerProductService: DeletePartnerProduct,
    private readonly authorization: Authorization
  ) {}

  static create(
    deletePartnerProductService: DeletePartnerProduct,
    authorization: Authorization
  ) {
    return new DeletePartnerProductRoute(
      "/products/:productId",
      HttpMethod.DELETE,
      deletePartnerProductService,
      authorization
    );
  }
  getHandler() {
    return async (request: Request, response: Response) => {
      const { productId } = request.params;
      const { partner } = request as any;

      const input: DeletePartnerProductInputDto = {
        partnerId: partner.id,
        productId,
      };

      await this.deletePartnerProductService.execute(input);

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
    return this.authorization.authorizationRoute;
  }
}
