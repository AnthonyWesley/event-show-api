import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import {
  UpdateLead,
  UpdateLeadInputDto,
} from "../../../usecase/lead/UpdateLead";

export class UpdateLeadRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateLeadService: UpdateLead,
    private readonly authorization: AuthorizationRoute
  ) {}

  static create(
    updateLeadService: UpdateLead,
    authorization: AuthorizationRoute
  ) {
    return new UpdateLeadRoute(
      "/leads/:leadId",
      HttpMethod.PATCH,
      updateLeadService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response) => {
      const { leadId } = request.params;
      const { user } = request as any;

      const {
        name,
        email,
        wasPresent,
        phone,
        notes,
        leadSourceId,
        customInterest,
        products,
        sellerId,
        customValues,
      } = request.body;
      console.log(request.body);

      const input: UpdateLeadInputDto = {
        companyId: user.companyId,
        leadId,
        name,
        email,
        phone,
        notes,
        leadSourceId,
        sellerId,
        wasPresent,
        customInterest,
        products,
        customValues,
      };

      const result = await this.updateLeadService.execute(input);

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
