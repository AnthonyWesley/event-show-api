import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import {
  UpdatePartnerProduct,
  UpdatePartnerProductInputDto,
} from "../../../usecase/product/UpdatePartnerProduct";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export class UpdatePartnerProductRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updatePartnerProductService: UpdatePartnerProduct,
    private readonly authorization: Authorization
  ) {}

  static create(
    updatePartnerProductService: UpdatePartnerProduct,
    authorization: Authorization
  ) {
    return new UpdatePartnerProductRoute(
      "/products/:productId",
      HttpMethod.PATCH,
      updatePartnerProductService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response) => {
      const { productId } = request.params;
      const { partner } = request as any;

      const { name, price } = request.body;

      const input: UpdatePartnerProductInputDto = {
        partnerId: partner.id,
        productId,
        name,
        price,
      };

      const result = await this.updatePartnerProductService.execute(input);

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
    return [this.authorization.authorizationRoute];
  }
}
