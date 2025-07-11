import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";
import {
  ListPendingAction,
  ListPendingActionInputDto,
} from "../../../usecase/pendingAction/ListPendingAction";

export class ListPendingActionRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly ListPendingActionService: ListPendingAction,
    private readonly authorization: Authorization
  ) {}

  public static create(
    ListPendingActionService: ListPendingAction,
    authorization: Authorization
  ) {
    return new ListPendingActionRoute(
      "/pending-action",
      HttpMethod.GET,
      ListPendingActionService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response) => {
      const { user } = request as any;

      const input: ListPendingActionInputDto = {
        companyId: user.companyId,
      };

      const result = await this.ListPendingActionService.execute(input);
      response.status(200).json(result);
    };
  }

  getPath(): string {
    return this.path;
  }

  getMethod(): HttpMethod {
    return this.method;
  }

  getMiddlewares() {
    return [this.authorization.authorizationRoute];
  }
}
