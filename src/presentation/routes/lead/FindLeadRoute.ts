import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { Authorization } from "../../../infra/http/middlewares/Authorization";
import {
  FindLead,
  FindLeadInputDto,
  FindLeadOutputDto,
} from "../../../usecase/lead/FindLead";

export type FindPartnerProductResponseDto = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  partnerId: string;
  createdAt: Date;
};

export class FindLeadRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findLeadService: FindLead,
    private readonly authorization: Authorization
  ) {}

  public static create(
    findLeadService: FindLead,
    authorization: Authorization
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
      const { partner } = request as any;

      const input: FindLeadInputDto = {
        partnerId: partner.id,
        leadId,
      };
      const result: FindLeadOutputDto =
        await this.findLeadService.execute(input);

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
    return this.authorization.authorizationRoute;
  }
}
