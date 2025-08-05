import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

import { CreateSellerEvent } from "../../../usecase/sellerEvent/CreateSellerEvent";
import { UpdateSellerEventGoal } from "../../../usecase/sellerEvent/UpdateSellerEventGoal";

export class UpdateSellerEventGoalRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateSellerEventGoalService: UpdateSellerEventGoal,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    updateSellerEventGoalService: UpdateSellerEventGoal,
    authorization: AuthorizationRoute
  ) {
    return new UpdateSellerEventGoalRoute(
      "/events/:eventId/sellerEvents/:sellerId",
      HttpMethod.PATCH,
      updateSellerEventGoalService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { eventId, sellerId } = request.params;

      const { goal } = request.body;
      const { user } = request as any;

      await this.updateSellerEventGoalService.execute({
        eventId,
        sellerId,
        companyId: user.companyId,
        goal,
      });

      response.status(204).send();
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
