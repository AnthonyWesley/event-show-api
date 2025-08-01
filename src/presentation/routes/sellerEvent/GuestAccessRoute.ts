import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { GuestAccess } from "../../../usecase/sellerEvent/GuestAccess";

export class GuestAccessRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly guestAccessService: GuestAccess,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    guestAccessService: GuestAccess,
    authorization: AuthorizationRoute
  ) {
    return new GuestAccessRoute(
      "/guest/:invite",
      HttpMethod.GET,
      guestAccessService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { user } = request as any;

      const { invite } = request.params;

      const result = await this.guestAccessService.execute({
        invite,
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
    return [];
  }
}
