import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { PlanType } from "../../../domain/entities/company/Company";
import { SuspendCompany } from "../../../usecase/company/SuspendCompany";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

export type suspendCompanyResponseDto = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: PlanType;
};

export class SuspendCompanyRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly suspendCompanyService: SuspendCompany,
    private readonly authorization: AuthorizationRoute
  ) {}

  static create(
    suspendCompanyService: SuspendCompany,
    authorization: AuthorizationRoute
  ) {
    return new SuspendCompanyRoute(
      "/companies/:id/suspend",
      HttpMethod.PATCH,
      suspendCompanyService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { id } = request.params;
      const result = await this.suspendCompanyService.execute({ id });
      response.status(200).json(result);
    };
  }

  getPath(): string {
    return this.path;
  }

  getMethod(): HttpMethod {
    return this.method;
  }

  public getMiddlewares() {
    return [this.authorization.userRoute];
  }
}
