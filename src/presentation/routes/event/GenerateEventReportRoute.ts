import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";
import { GenerateEventReport } from "../../../usecase/event/GenerateEventReport";

export type GenerateEventReportOutputDto = {
  id: string;
  pdfBuffer: Buffer;
};

export class GenerateEventReportRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly generateEventReportServer: GenerateEventReport,
    private readonly authorization: Authorization
  ) {}

  public static create(
    generateEventReportServer: GenerateEventReport,
    authorization: Authorization
  ) {
    return new GenerateEventReportRoute(
      "/events/:eventId/export",
      HttpMethod.GET,
      generateEventReportServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { partner } = request as any;
      const { eventId } = request.params;

      const input = { partnerId: partner.id, eventId };
      const result = await this.generateEventReportServer.execute(input);

      response.setHeader("Content-Type", "application/pdf");
      response.setHeader(
        "Content-Disposition",
        `attachment; filename="relatorio-evento-${result.id}.pdf"`
      );
      response.status(200).send(result.pdfBuffer);
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
