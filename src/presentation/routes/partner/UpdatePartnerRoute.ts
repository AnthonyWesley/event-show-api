import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { PlanType } from "../../../domain/entities/partner/Partner";
import {
  UpdatePartner,
  UpdatePartnerInputDto,
  UpdatePartnerOutputDto,
} from "../../../usecase/partner/UpdatePartner";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export type UpdatePartnerResponseDto = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: PlanType;
};

export class UpdatePartnerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updatePartnerService: UpdatePartner,
    private readonly authorization: Authorization
  ) {}

  static create(
    updatePartnerService: UpdatePartner,
    authorization: Authorization
  ) {
    return new UpdatePartnerRoute(
      "/partner/:id",
      HttpMethod.PATCH,
      updatePartnerService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { id } = request.params;
      const { name, email, plan, phone, maxConcurrentEvents } = request.body;

      const input: UpdatePartnerInputDto = {
        id,
        name,
        email,
        phone,
        plan,
        maxConcurrentEvents,
      };

      const output: UpdatePartnerOutputDto =
        await this.updatePartnerService.execute(input);

      const result = { id: output.id };
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
