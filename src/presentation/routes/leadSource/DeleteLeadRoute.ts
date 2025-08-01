import { Response, Request } from "express";

import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { DeleteLeadInputDto } from "../../../usecase/lead/DeleteLead";
import {
  DeleteLeadSource,
  DeleteLeadSourceInputDto,
} from "../../../usecase/leadSource/DeleteLeadSource";

export type DeleteLeadSourceRouteResponseDto = {
  id: string;
  companyId: string;
};
export class DeleteLeadSourceRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deleteLeadSourceService: DeleteLeadSource,
    private readonly authorization: AuthorizationRoute
  ) {}

  static create(
    deleteLeadSourceService: DeleteLeadSource,
    authorization: AuthorizationRoute
  ) {
    return new DeleteLeadSourceRoute(
      "/sources/:leadSourceId",
      HttpMethod.DELETE,
      deleteLeadSourceService,
      authorization
    );
  }
  getHandler() {
    return async (request: Request, response: Response) => {
      const { leadSourceId } = request.params;
      const { user } = request as any;

      const input: DeleteLeadSourceInputDto = {
        companyId: user.companyId,
        leadSourceId,
      };

      await this.deleteLeadSourceService.execute(input);

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
    return [this.authorization.userRoute];
  }
}
