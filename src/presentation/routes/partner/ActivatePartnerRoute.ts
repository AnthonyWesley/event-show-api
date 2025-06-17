import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { PlanType } from "../../../domain/entities/partner/Partner";
import {
  UpdatePartnerInputDto,
  UpdatePartnerOutputDto,
} from "../../../usecase/partner/UpdatePartner";
import { ActivatePartner } from "../../../usecase/partner/ActivatePartner";

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
    private readonly activePartnerService: ActivatePartner
  ) {}

  static create(activePartnerService: ActivatePartner) {
    return new ActivatePartnerRoute(
      "/partners/:id/activate",
      HttpMethod.PUT,
      activePartnerService
    );
  }

  getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { id } = request.params;
      const { name, email, plan, phone, maxConcurrentEvents, status } =
        request.body;

      const input: UpdatePartnerInputDto = {
        id,
        name,
        email,
        phone,
        plan,
        maxConcurrentEvents,
        status,
      };

      const output: UpdatePartnerOutputDto =
        await this.activePartnerService.execute(input);

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
}
