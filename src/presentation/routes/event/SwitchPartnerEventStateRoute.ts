import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { Authorization } from "../../../infra/http/middlewares/Authorization";
import { SwitchPartnerEventState } from "../../../usecase/event/SwitchPartnerEventState";

export class SwitchPartnerEventStateRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly switchPartnerEventStateService: SwitchPartnerEventState,
    private readonly authorization: Authorization
  ) {}

  static create(
    switchPartnerEventStateService: SwitchPartnerEventState,
    authorization: Authorization
  ) {
    return new SwitchPartnerEventStateRoute(
      "/events/:eventId/toggle-end",
      HttpMethod.PATCH,
      switchPartnerEventStateService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response) => {
      const { eventId } = request.params;
      const { partner } = request as any;

      const result = await this.switchPartnerEventStateService.execute({
        eventId,
        partnerId: partner.id,
      });
      response.status(200).json(result);
    };
  }

  getPath(): string {
    return this.path;
  }

  getMethod(): HttpMethod {
    return this.method;
  }

  public getMiddlewares() {
    return [this.authorization.authorizationRoute];
  }
}
