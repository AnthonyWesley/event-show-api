import { Request, Response } from "express";
import {
  CreateEventSeller,
  CreateEventSellerInputDto,
} from "../../../usecase/seller/CreateEventSeller";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export type CreateEventSellerResponseDto = {
  id: string;
};

export class CreateEventSellerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createEventSellerService: CreateEventSeller,
    private readonly authorization: Authorization
  ) {}

  public static create(
    createEventSellerService: CreateEventSeller,
    authorization: Authorization
  ) {
    return new CreateEventSellerRoute(
      "/sellers",
      HttpMethod.POST,
      createEventSellerService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { partner } = request as any;

      const { name, email, phone, photo } = request.body;

      const input: CreateEventSellerInputDto = {
        name,
        email,
        phone,
        photo,
        partnerId: partner.id,
      };

      const output: CreateEventSellerResponseDto =
        await this.createEventSellerService.execute(input);

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
    return this.authorization.authorizationRoute;
  }
}
