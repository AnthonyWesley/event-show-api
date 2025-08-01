import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { CreateSubscription } from "../../../usecase/subscription/CreateSubscription";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

export class CreateSubscriptionRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createSubscriptionService: CreateSubscription,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    createSubscriptionService: CreateSubscription,
    authorization: AuthorizationRoute
  ) {
    return new CreateSubscriptionRoute(
      "/subscriptions",
      HttpMethod.POST,
      createSubscriptionService,
      authorization
    );
  }

  public getHandler() {
    return async (req: Request, res: Response) => {
      const output = await this.createSubscriptionService.execute(req.body);
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
    return [this.authorization.userRoute];
  }
}
