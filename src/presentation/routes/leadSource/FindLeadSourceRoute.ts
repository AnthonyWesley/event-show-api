import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

import {
  FindLeadSource,
  FindLeadSourceInputDto,
} from "../../../usecase/leadSource/FindLeadSource";

export type FindProductResponseDto = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  companyId: string;
  createdAt: Date;
};

export class FindLeadSourceRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findLeadSourceService: FindLeadSource,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    findLeadSourceService: FindLeadSource,
    authorization: AuthorizationRoute
  ) {
    return new FindLeadSourceRoute(
      "/sources/:leadSourceId",
      HttpMethod.GET,
      findLeadSourceService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { leadSourceId } = request.params;
      const { user } = request as any;

      const input: FindLeadSourceInputDto = {
        companyId: user.companyId,
        leadSourceId,
      };

      const result = await this.findLeadSourceService.execute(input);

      response.status(200).json(result);
    };
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }

  public getMiddlewares() {
    return [this.authorization.userRoute];
  }
}
