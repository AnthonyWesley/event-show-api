import { Request, Response } from "express";
import {
  CreateProduct,
  CreateProductInputDto,
} from "../../../usecase/product/CreateProduct";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export type CreateProductResponseDto = {
  id: string;
};

export class CreateProductRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createProductService: CreateProduct,
    private readonly authorization: Authorization
  ) {}

  public static create(
    createProductService: CreateProduct,
    authorization: Authorization
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
      const { partner } = request as any;

      const { name, price } = request.body;

      const input: CreateProductInputDto = {
        name,
        price,
        partnerId: partner.id,
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
    return [this.authorization.authorizationRoute];
  }
}
