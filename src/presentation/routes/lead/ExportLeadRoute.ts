import { Request, Response } from "express";
import { Authorization } from "../../../infra/http/middlewares/Authorization";
import { HttpMethod, IRoute } from "../IRoute";

import { ExportLead } from "../../../usecase/lead/ExportLead";

export type ExportLeadRouteResponseDto = {
  id: string;
};

export class ExportLeadRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly exportLeadRouteService: ExportLead,
    private readonly authorization: Authorization
  ) {}

  public static create(
    exportLeadRouteService: ExportLead,
    authorization: Authorization
  ) {
    return new ExportLeadRoute(
      "/export/leads/:eventId?",
      HttpMethod.GET,
      exportLeadRouteService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { partner } = request as any;
      const { eventId } = request.params;

      const result = await this.exportLeadRouteService.execute({
        partnerId: partner.id,
        eventId,
      });

      response.setHeader("Content-Type", result.contentType);
      response.setHeader(
        "Content-Disposition",
        `attachment; filename="${result.fileName}"`
      );
      response.send(result.file);
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
