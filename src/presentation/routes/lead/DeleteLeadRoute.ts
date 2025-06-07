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
  partnerId: string;
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
      "/events/:eventId/leads/:leadId",
      HttpMethod.DELETE,
      deleteLeadService,
      authorization
    );
  }
  getHandler() {
    return async (request: Request, response: Response) => {
      const { eventId, leadId } = request.params;
      const { partner } = request as any;

      const input: DeleteLeadInputDto = {
        partnerId: partner.id,
        id: leadId,
        eventId,
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
    return this.authorization.authorizationRoute;
  }
}
