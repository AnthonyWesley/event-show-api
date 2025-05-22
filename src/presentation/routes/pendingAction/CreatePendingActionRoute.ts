import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";
import {
  CreatePendingAction,
  CreatePendingActionInputDto,
} from "../../../usecase/pendingAction/CreatePendingAction";

export class CreatePendingActionRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createPendingActionService: CreatePendingAction,
    private readonly authorization: Authorization
  ) {}

  public static create(
    createPendingActionService: CreatePendingAction,
    authorization: Authorization
  ) {
    return new CreatePendingActionRoute(
      "/pending-action",
      HttpMethod.POST,
      createPendingActionService,
      authorization
    );
  }

  getHandler() {
    return async (req: Request, res: Response) => {
      // const { eventId } = req.params;
      const { partner } = req as any;
      const { sellerId, actionType, payload, targetId, eventId } = req.body;

      const input: CreatePendingActionInputDto = {
        partnerId: partner.id,
        eventId,
        targetId,
        sellerId,
        actionType,
        payload,
      };

      const result = await this.createPendingActionService.execute(input);
      res.status(201).json({ id: result.id });
    };
  }

  getPath(): string {
    return this.path;
  }

  getMethod(): HttpMethod {
    return this.method;
  }

  getMiddlewares() {
    return this.authorization.authorizationRoute;
  }
}
