import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { PlanType } from "../../../domain/entities/company/Company";

import { ActivateCompany } from "../../../usecase/company/ActivateCompany";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export type UpdateCompanyResponseDto = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: PlanType;
};

export class ActivateCompanyRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly activeCompanyService: ActivateCompany,
    private readonly authorization: Authorization
  ) {}

  static create(
    activeCompanyService: ActivateCompany,
    authorization: Authorization
  ) {
    return new ActivateCompanyRoute(
      "/companies/:id/activate",
      HttpMethod.PATCH,
      activeCompanyService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { id } = request.params;

      const result = await this.activeCompanyService.execute({ id });
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
    return [this.authorization.authorizationRoute];
  }
}
