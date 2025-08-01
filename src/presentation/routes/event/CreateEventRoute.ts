import { Request, Response } from "express";
import {
  CreateEvent,
  CreateEventInputDto,
} from "../../../usecase/event/CreateEvent";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { checkFeatures } from "../../../infra/http/middlewares/checkFeature";

export type CreateEventResponseDto = {
  id: string;
};

export class CreateEventRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createEventService: CreateEvent,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    createEventService: CreateEvent,
    authorization: AuthorizationRoute
  ) {
    return new CreateEventRoute(
      "/events",
      HttpMethod.POST,
      createEventService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { user } = request as any;

      const { name, goal, goalType, photo } = request.body;

      const input: CreateEventInputDto = {
        name,
        companyId: user.companyId,
        goal,
        goalType,
        photo,
      };

      const output: CreateEventResponseDto =
        await this.createEventService.execute(input);

      const result = { id: output.id };

      response.status(201).json(result);
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
