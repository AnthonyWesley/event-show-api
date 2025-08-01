import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import {
  FindLead,
  FindLeadInputDto,
  FindLeadOutputDto,
} from "../../../usecase/lead/FindLead";

export type FindProductResponseDto = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  companyId: string;
  createdAt: Date;
};

export class FindLeadRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findLeadService: FindLead,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    findLeadService: FindLead,
    authorization: AuthorizationRoute
  ) {
    return new FindLeadRoute(
      "/leads/:leadId",
      HttpMethod.GET,
      findLeadService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { leadId } = request.params;
      const { user } = request as any;

      const input: FindLeadInputDto = {
        companyId: user.companyId,
        leadId,
      };
      const result: FindLeadOutputDto = await this.findLeadService.execute(
        input
      );

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
