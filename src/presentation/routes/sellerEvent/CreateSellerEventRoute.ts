import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

import { CreateSellerEvent } from "../../../usecase/sellerEvent/CreateSellerEvent";

export class CreateSellerEventRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createSellerEventService: CreateSellerEvent,
    private readonly authorization: Authorization
  ) {}

  public static create(
    createSellerEventService: CreateSellerEvent,
    authorization: Authorization
  ) {
    return new CreateSellerEventRoute(
      "/events/:eventId/sellers/:sellerId",
      HttpMethod.POST,
      createSellerEventService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { eventId, sellerId } = request.params;
      const { user } = request as any;

      const output = await this.createSellerEventService.execute({
        eventId,
        sellerId,
      });

      response.status(201).json({ id: output.id });
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
