import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

import { CreateSellerEvent } from "../../../usecase/sellerEvent/CreateSellerEvent";

export class CreateSellerEventRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createSellerEventService: CreateSellerEvent,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    createSellerEventService: CreateSellerEvent,
    authorization: AuthorizationRoute
  ) {
    return new CreateSellerEventRoute(
      "/events/:eventId/sellers/batch",
      HttpMethod.POST,
      createSellerEventService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { eventId } = request.params;
      console.log(request.body);
      const { sellers } = request.body;

      const { user } = request as any;

      const output = await this.createSellerEventService.execute({
        eventId,
        sellers,
        companyId: user.companyId,
      });

      response.status(201).json({ sellers: output });
    };
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }

  public getMiddlewares() {
    return [this.authorization.userRoute];
  }
}
