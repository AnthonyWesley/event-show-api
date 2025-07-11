import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { CancelSubscription } from "../../../usecase/subscription/CancelSubscription";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export class CancelSubscriptionRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly cancelSubscriptionService: CancelSubscription,
    private readonly authorization: Authorization
  ) {}

  public static create(
    cancelSubscriptionService: CancelSubscription,
    authorization: Authorization
  ) {
    return new CancelSubscriptionRoute(
      "/subscriptions/:id/cancel",
      HttpMethod.POST,
      cancelSubscriptionService,
      authorization
    );
  }

  public getHandler() {
    return async (req: Request, res: Response) => {
      const output = await this.cancelSubscriptionService.execute(req.body);
      res.status(201).json(output);
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
