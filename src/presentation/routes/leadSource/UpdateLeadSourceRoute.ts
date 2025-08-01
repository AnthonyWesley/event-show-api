import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

import {
  UpdateLeadSource,
  UpdateLeadSourceInputDto,
} from "../../../usecase/leadSource/UpdateLeadSource";

export class UpdateLeadSourceRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateLeadSourceService: UpdateLeadSource,
    private readonly authorization: AuthorizationRoute
  ) {}

  static create(
    updateLeadSourceService: UpdateLeadSource,
    authorization: AuthorizationRoute
  ) {
    return new UpdateLeadSourceRoute(
      "/sources/:leadSourceId",
      HttpMethod.PATCH,
      updateLeadSourceService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response) => {
      const { leadSourceId } = request.params;
      const { user } = request as any;

      const { name, description } = request.body;

      const input: UpdateLeadSourceInputDto = {
        companyId: user.companyId,
        leadSourceId,
        name,
        description,
      };

      const result = await this.updateLeadSourceService.execute(input);

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
