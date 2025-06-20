import { Request, Response } from "express";
import {
  CreatePartnerProduct,
  CreatePartnerProductInputDto,
} from "../../../usecase/product/CreatePartnerProduct";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export type CreatePartnerProductResponseDto = {
  id: string;
};

export class CreatePartnerProductRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createPartnerProductService: CreatePartnerProduct,
    private readonly authorization: Authorization
  ) {}

  public static create(
    createPartnerProductService: CreatePartnerProduct,
    authorization: Authorization
  ) {
    return new CreatePartnerProductRoute(
      "/products",
      HttpMethod.POST,
      createPartnerProductService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { partner } = request as any;

      const { name, price } = request.body;

      const input: CreatePartnerProductInputDto = {
        name,
        price,
        partnerId: partner.id,
      };

      const output: CreatePartnerProductResponseDto =
        await this.createPartnerProductService.execute(input);
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
