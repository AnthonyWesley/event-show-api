import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { PlanType } from "../../../domain/entities/partner/Partner";
import { SuspendPartner } from "../../../usecase/partner/SuspendPartner";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export type suspendPartnerResponseDto = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: PlanType;
};

export class SuspendPartnerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly suspendPartnerService: SuspendPartner,
    private readonly authorization: Authorization
  ) {}

  static create(
    suspendPartnerService: SuspendPartner,
    authorization: Authorization
  ) {
    return new SuspendPartnerRoute(
      "/partners/:id/suspend",
      HttpMethod.PUT,
      suspendPartnerService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { id } = request.params;
      const result = await this.suspendPartnerService.execute({ id });
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
    return this.authorization.authorizationRoute;
  }
}
