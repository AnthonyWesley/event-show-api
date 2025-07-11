import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import {
  UpdateEvent,
  UpdateEventInputDto,
} from "../../../usecase/event/UpdateEvent";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export class UpdateEventRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateEventService: UpdateEvent,
    private readonly authorization: Authorization
  ) {}

  static create(updateEventService: UpdateEvent, authorization: Authorization) {
    return new UpdateEventRoute(
      "/events/:eventId",
      HttpMethod.PATCH,
      updateEventService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response) => {
      const { eventId } = request.params;
      const { user } = request as any;
      const { name, startDate, endDate, goal, goalType, isActive } =
        request.body;

      const input: UpdateEventInputDto = {
        eventId,
        companyId: user.companyId,
        goal,
        goalType,
        name,
        startDate,
        endDate,
        isActive,
      };
      const result = await this.updateEventService.execute(input);

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
