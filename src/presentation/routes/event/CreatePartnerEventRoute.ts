import { Request, Response } from "express";
import {
  CreatePartnerEvent,
  CreatePartnerEventInputDto,
} from "../../../usecase/event/CreatePartnerEvent";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export type CreatePartnerEventResponseDto = {
  id: string;
};

export class CreatePartnerEventRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createPartnerEventService: CreatePartnerEvent,
    private readonly authorization: Authorization
  ) {}

  public static create(
    createPartnerEventService: CreatePartnerEvent,
    authorization: Authorization
  ) {
    return new CreatePartnerEventRoute(
      "/events",
      HttpMethod.POST,
      createPartnerEventService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { partner } = request as any;

      const { name, goal, goalType, photo } = request.body;

      const input: CreatePartnerEventInputDto = {
        name,
        partnerId: partner.id,
        goal,
        goalType,
        photo,
      };

      const output: CreatePartnerEventResponseDto =
        await this.createPartnerEventService.execute(input);

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
    return [this.authorization.authorizationRoute];
  }
}
