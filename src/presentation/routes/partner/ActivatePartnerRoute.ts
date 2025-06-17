import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { PlanType } from "../../../domain/entities/partner/Partner";
import {
  UpdatePartnerInputDto,
  UpdatePartnerOutputDto,
} from "../../../usecase/partner/UpdatePartner";
import { ActivatePartner } from "../../../usecase/partner/ActivatePartner";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export type UpdatePartnerResponseDto = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: PlanType;
};

export class ActivatePartnerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly activePartnerService: ActivatePartner,
    private readonly authorization: Authorization
  ) {}

  static create(
    activePartnerService: ActivatePartner,
    authorization: Authorization
  ) {
    return new ActivatePartnerRoute(
      "/partners/:id/activate",
      HttpMethod.PUT,
      activePartnerService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { id } = request.params;

      const result = await this.activePartnerService.execute({ id });
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
