import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import {
  CreatePendingAction,
  CreatePendingActionInputDto,
} from "../../../usecase/pendingAction/CreatePendingAction";

export class CreatePendingActionRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createPendingActionService: CreatePendingAction,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    createPendingActionService: CreatePendingAction,
    authorization: AuthorizationRoute
  ) {
    return new CreatePendingActionRoute(
      "/pending-action",
      HttpMethod.POST,
      createPendingActionService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response) => {
      // const { eventId } = req.params;
      const { user } = request as any;
      const { sellerId, actionType, payload, targetId, eventId } = request.body;

      const input: CreatePendingActionInputDto = {
        companyId: user.companyId,
        eventId,
        targetId,
        sellerId,
        actionType,
        payload,
      };

      const result = await this.createPendingActionService.execute(input);
      response.status(201).json({ id: result.id });
    };
  }

  getPath(): string {
    return this.path;
  }

  getMethod(): HttpMethod {
    return this.method;
  }

  getMiddlewares() {
    return [this.authorization.userRoute];
  }
}
