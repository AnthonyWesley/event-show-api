import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { SendGuestAccessInvite } from "../../../usecase/sellerEvent/SendGuestAccessInvite";

export class SendGuestAccessInviteRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly sendGuestAccessInvite: SendGuestAccessInvite,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    sendGuestAccessInvite: SendGuestAccessInvite,
    authorization: AuthorizationRoute
  ) {
    return new SendGuestAccessInviteRoute(
      "/events/:eventId/guest/:sellerId",
      HttpMethod.POST,
      sendGuestAccessInvite,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { eventId, sellerId } = request.params;
      const { user } = request as any;

      const output = await this.sendGuestAccessInvite.execute({
        companyId: user.companyId,
        eventId,
        sellerId,
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
