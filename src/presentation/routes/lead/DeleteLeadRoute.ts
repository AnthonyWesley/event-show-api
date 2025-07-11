import { Response, Request } from "express";

import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";
import {
  DeleteLead,
  DeleteLeadInputDto,
} from "../../../usecase/lead/DeleteLead";

export type DeleteLeadRouteResponseDto = {
  id: string;
  eventId: string;
  companyId: string;
};
export class DeleteLeadRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deleteLeadService: DeleteLead,
    private readonly authorization: Authorization
  ) {}

  static create(deleteLeadService: DeleteLead, authorization: Authorization) {
    return new DeleteLeadRoute(
      "/leads/:leadId",
      HttpMethod.DELETE,
      deleteLeadService,
      authorization
    );
  }
  getHandler() {
    return async (request: Request, response: Response) => {
      const { eventId, leadId } = request.params;
      const { user } = request as any;

      const input: DeleteLeadInputDto = {
        companyId: user.companyId,
        leadId,
      };

      await this.deleteLeadService.execute(input);

      response.status(201).json();
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
