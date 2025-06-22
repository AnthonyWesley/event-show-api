import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { Authorization } from "../../../infra/http/middlewares/Authorization";

import { Goal } from "../../../domain/entities/event/Event";
import { ImpersonatePartner } from "../../../usecase/admin/ImpersonatePartner";

export type FindPartnerResponseDto = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  goal: number;
  goalType: Goal;
  partnerId: string;
  createdAt: Date;
};

export class ImpersonatePartnerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly impersonatePartnerServer: ImpersonatePartner,
    private readonly authorization: Authorization
  ) {}

  public static create(
    impersonatePartnerServer: ImpersonatePartner,
    authorization: Authorization
  ) {
    return new ImpersonatePartnerRoute(
      "/impersonate/:partnerId",
      HttpMethod.GET,
      impersonatePartnerServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { partnerId } = request.params;
      const admin = (request as any).admin;

      const result = await this.impersonatePartnerServer.execute({
        partnerId,
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
    return this.authorization.adminAuthorizationRoute;
  }
}
