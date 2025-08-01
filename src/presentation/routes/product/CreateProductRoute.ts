import { Request, Response } from "express";
import {
  CreateProduct,
  CreateProductInputDto,
} from "../../../usecase/product/CreateProduct";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { checkFeatures } from "../../../infra/http/middlewares/checkFeature";

export type CreateProductResponseDto = {
  id: string;
};

export class CreateProductRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createProductService: CreateProduct,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    createProductService: CreateProduct,
    authorization: AuthorizationRoute
  ) {
    return new CreateProductRoute(
      "/products",
      HttpMethod.POST,
      createProductService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { user } = request as any;

      const { name, price } = request.body;

      const keys = (request as any).featureValues;

      const input: CreateProductInputDto = {
        name,
        price,
        companyId: user.companyId,
        keys,
      };

      const output: CreateProductResponseDto =
        await this.createProductService.execute(input);
      const result = { id: output.id };

      response.status(201).json(result);
    };
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }

  public getMiddlewares() {
    return [
      this.authorization.userRoute,
      checkFeatures(["limit_product", "unlimited_product"]),
    ];
  }
}
