import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { ListLeadsByCompany } from "../../../usecase/lead/ListLeadsByCompany";
import { ListLeadSource } from "../../../usecase/leadSource/ListLeadSource";

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

export class ListLeadSourceRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listLeadSource: ListLeadSource,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    listLeadSource: ListLeadSource,
    authorization: AuthorizationRoute
  ) {
    return new ListLeadSourceRoute(
      "/sources",
      HttpMethod.GET,
      listLeadSource,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { user } = request as any;
      const search = request.query.search as string | undefined;
      const output = await this.listLeadSource.execute({
        companyId: user.companyId,
        search: typeof search === "string" ? search.trim() : undefined,
      });

      const result = {
        sources: output.map((source) => ({
          id: source.id,
          name: source.name,
          photo: source.photo,
          photoPublicId: source.photoPublicId,
          description: source.description,
          companyId: source.companyId,
          createdAt: source.createdAt,
        })),
      };

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
