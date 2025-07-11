import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

import { CreateSellerEvent } from "../../../usecase/sellerEvent/CreateSellerEvent";
import { SendGuestAccessInvite } from "../../../usecase/sellerEvent/SendGuestAccessInvite";

export class SendGuestAccessInviteRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly sendGuestAccessInvite: SendGuestAccessInvite,
    private readonly authorization: Authorization
  ) {}

  public static create(
    sendGuestAccessInvite: SendGuestAccessInvite,
    authorization: Authorization
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
    return [this.authorization.authorizationRoute];
  }
}
