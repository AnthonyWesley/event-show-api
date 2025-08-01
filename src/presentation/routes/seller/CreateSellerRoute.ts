import { Request, Response } from "express";
import {
  CreateSeller,
  CreateSellerInputDto,
} from "../../../usecase/seller/CreateSeller";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { checkFeatures } from "../../../infra/http/middlewares/checkFeature";

export type CreateSellerResponseDto = {
  id: string;
};

export class CreateSellerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createSellerService: CreateSeller,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    createSellerService: CreateSeller,
    authorization: AuthorizationRoute
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
      const { user } = request as any;

      const { name, email, phone, photo } = request.body;
      const keys = (request as any).featureValues;

      const input: CreateSellerInputDto = {
        name,
        email,
        phone,
        photo,
        companyId: user.companyId,
        keys,
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
    return [
      this.authorization.userRoute,
      checkFeatures(["limit_seller", "unlimited_seller"]),
    ];
  }
}
