import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { ListLeadsByCompany } from "../../../usecase/lead/ListLeadsByCompany";

export type ListLeadResponseDto = {
  products: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    companyId: string;
    createdAt: Date;
  }[];
};

export class ListLeadByCompanies implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listLeadServer: ListLeadsByCompany,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    listLeadServer: ListLeadsByCompany,
    authorization: AuthorizationRoute
  ) {
    return new ListLeadByCompanies(
      "/leads",
      HttpMethod.GET,
      listLeadServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { user } = request as any;
      const { eventId } = request.params;

      const result = await this.listLeadServer.execute(user.companyId);

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
