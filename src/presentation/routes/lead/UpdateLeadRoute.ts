import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { Authorization } from "../../../infra/http/middlewares/Authorization";
import {
  UpdateLead,
  UpdateLeadInputDto,
} from "../../../usecase/lead/UpdateLead";

export class UpdateLeadRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateLeadService: UpdateLead,
    private readonly authorization: Authorization
  ) {}

  static create(updateLeadService: UpdateLead, authorization: Authorization) {
    return new UpdateLeadRoute(
      "/leads/:leadId",
      HttpMethod.PUT,
      updateLeadService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response) => {
      const { leadId } = request.params;
      const { partner } = request as any;

      const { name, email, phone, notes, source, customInterest, products } =
        request.body;

      const input: UpdateLeadInputDto = {
        partnerId: partner.id,
        leadId,
        name,
        email,
        phone,
        notes,
        source,
        customInterest,
        products,
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
    return this.authorization.authorizationRoute;
  }
}
