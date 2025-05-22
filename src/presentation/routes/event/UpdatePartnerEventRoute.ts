import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import {
  UpdatePartnerEvent,
  UpdatePartnerEventInputDto,
} from "../../../usecase/event/UpdatePartnerEvent";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export class UpdatePartnerEventRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updatePartnerEventService: UpdatePartnerEvent,
    private readonly authorization: Authorization
  ) {}

  static create(
    updatePartnerEventService: UpdatePartnerEvent,
    authorization: Authorization
  ) {
    return new UpdatePartnerEventRoute(
      "/events/:eventId",
      HttpMethod.PUT,
      updatePartnerEventService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response) => {
      const { eventId } = request.params;
      const { partner } = request as any;
      const { name, startDate, endDate, goal, goalType, isActive } =
        request.body;

      const input: UpdatePartnerEventInputDto = {
        eventId,
        partnerId: partner.id,
        goal,
        goalType,
        name,
        startDate,
        endDate,
        isActive,
      };
      const result = await this.updatePartnerEventService.execute(input);

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
    return this.authorization.authorizationRoute;
  }
}
