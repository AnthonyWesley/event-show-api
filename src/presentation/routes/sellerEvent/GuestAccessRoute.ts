import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";
import { GuestAccess } from "../../../usecase/sellerEvent/GuestAccess";

export class GuestAccessRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly guestAccessService: GuestAccess,
    private readonly authorization: Authorization
  ) {}

  public static create(
    guestAccessService: GuestAccess,
    authorization: Authorization
  ) {
    return new GuestAccessRoute(
      "/events/:eventId/guest/:sellerId",
      HttpMethod.GET,
      guestAccessService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { user } = request as any;
      const { eventId, sellerId } = request.params;

      const result = await this.guestAccessService.execute({
        companyId: user.companyId,
        email: user.email,
        eventId,
        sellerId,
      });

      response.status(200).json(result);
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
