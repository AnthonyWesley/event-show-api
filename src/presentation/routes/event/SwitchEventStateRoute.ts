import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { Authorization } from "../../../infra/http/middlewares/Authorization";
import { SwitchEventState } from "../../../usecase/event/SwitchEventState";

export class SwitchEventStateRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly switchEventStateService: SwitchEventState,
    private readonly authorization: Authorization
  ) {}

  static create(
    switchEventStateService: SwitchEventState,
    authorization: Authorization
  ) {
    return new SwitchEventStateRoute(
      "/events/:eventId/toggle-end",
      HttpMethod.PATCH,
      switchEventStateService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response) => {
      const { eventId } = request.params;
      const { partner } = request as any;

      const result = await this.switchEventStateService.execute({
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
