import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export class GuestAccessRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly authorization: Authorization
  ) {}

  public static create(authorization: Authorization) {
    return new GuestAccessRoute(
      "/guest/:sellerId",
      HttpMethod.GET,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { partner, guest } = request as any;

      if (!partner || !guest) {
        response.status(401).json({ message: "Unauthorized access" });
      }

      response.status(200).json({ message: "Access granted" });
    };
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }

  public getMiddlewares() {
    return this.authorization.partnerAndGuestAuthorizationRoute;
  }
}
