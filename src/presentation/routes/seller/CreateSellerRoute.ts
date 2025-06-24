import { Request, Response } from "express";
import {
  CreateSeller,
  CreateSellerInputDto,
} from "../../../usecase/seller/CreateSeller";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export type CreateSellerResponseDto = {
  id: string;
};

export class CreateSellerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createSellerService: CreateSeller,
    private readonly authorization: Authorization
  ) {}

  public static create(
    createSellerService: CreateSeller,
    authorization: Authorization
  ) {
    return new CreateSellerRoute(
      "/sellers",
      HttpMethod.POST,
      createSellerService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { partner } = request as any;

      const { name, email, phone, photo } = request.body;

      const input: CreateSellerInputDto = {
        name,
        email,
        phone,
        photo,
        partnerId: partner.id,
      };

      const output: CreateSellerResponseDto =
        await this.createSellerService.execute(input);

      response.status(201).json(output);
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
