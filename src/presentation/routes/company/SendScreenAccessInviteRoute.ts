import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import {
  ScreenAccessType,
  SendScreenAccessInvite,
} from "../../../usecase/company/SendScreenAccessInvite";

export class SendScreenAccessInviteRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly sendScreenAccessInviteService: SendScreenAccessInvite,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    sendScreenAccessInviteService: SendScreenAccessInvite,
    authorization: AuthorizationRoute
  ) {
    return new SendScreenAccessInviteRoute(
      "/events/:eventId/invite/:type",
      HttpMethod.POST,
      sendScreenAccessInviteService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { eventId, type } = request.params;
      const { phone } = request.body;
      const { user } = request as any;

      const output = await this.sendScreenAccessInviteService.execute({
        companyId: user.companyId,
        eventId,
        phone,
        screenAccess: type as ScreenAccessType,
      });

      response.status(201).json(output.link);
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
