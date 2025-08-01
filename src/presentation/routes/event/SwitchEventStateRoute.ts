import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { SwitchEventState } from "../../../usecase/event/SwitchEventState";
import { checkFeatures } from "../../../infra/http/middlewares/checkFeature";

export class SwitchEventStateRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly switchEventStateService: SwitchEventState,
    private readonly authorization: AuthorizationRoute
  ) {}

  static create(
    switchEventStateService: SwitchEventState,
    authorization: AuthorizationRoute
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
      const { user } = request as any;
      const eventLimit =
        (request as any).featureValues?.["limit_event"] ?? null;

      console.log((request as any).featureValues);

      const result = await this.switchEventStateService.execute({
        eventId,
        companyId: user.companyId,
        eventLimit,
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
    return [this.authorization.userRoute, checkFeatures(["limit_event"])];
  }
}
