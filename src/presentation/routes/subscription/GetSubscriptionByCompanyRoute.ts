import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { GetSubscriptionByCompany } from "../../../usecase/subscription/GetSubscriptionByCompany";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export class GetSubscriptionByCompanyRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly getSubscriptionByCompanyService: GetSubscriptionByCompany,
    private readonly authorization: Authorization
  ) {}

  public static create(
    getSubscriptionByCompanyService: GetSubscriptionByCompany,
    authorization: Authorization
  ) {
    return new GetSubscriptionByCompanyRoute(
      "/subscriptions/company/:companyId",
      HttpMethod.POST,
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
    return [this.authorization.authorizationRoute];
  }
}
