import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { GetSubscriptionByCompany } from "../../../usecase/subscription/GetSubscriptionByCompany";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

export class GetSubscriptionByCompanyRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly getSubscriptionByCompanyService: GetSubscriptionByCompany,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    getSubscriptionByCompanyService: GetSubscriptionByCompany,
    authorization: AuthorizationRoute
  ) {
    return new GetSubscriptionByCompanyRoute(
      "/subscriptions/company/:companyId",
      HttpMethod.GET,
      getSubscriptionByCompanyService,
      authorization
    );
  }

  public getHandler() {
    return async (req: Request, res: Response) => {
      const { companyId } = req.params;

      const subscription = await this.getSubscriptionByCompanyService.execute(
        companyId
      );
      res.json(subscription);
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
