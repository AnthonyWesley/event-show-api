import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

import { Goal } from "../../../domain/entities/event/Event";
import { ImpersonateCompany } from "../../../usecase/admin/ImpersonateCompany";

export type FindCompanyResponseDto = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  goal: number;
  goalType: Goal;
  companyId: string;
  createdAt: Date;
};

export class ImpersonateCompanyRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly impersonateCompanyServer: ImpersonateCompany,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    impersonateCompanyServer: ImpersonateCompany,
    authorization: AuthorizationRoute
  ) {
    return new ImpersonateCompanyRoute(
      "/impersonate/:userId",
      HttpMethod.GET,
      impersonateCompanyServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { userId } = request.params;
      const admin = (request as any).admin;

      const result = await this.impersonateCompanyServer.execute({
        userId,
        adminId: admin.id,
      });

      response.status(200).json(result);
    };
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }

  public getMiddlewares() {
    return [this.authorization.adminRoute];
  }
}
