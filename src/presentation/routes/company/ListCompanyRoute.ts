import { Response, Request } from "express";
import { ListCompany } from "../../../usecase/company/ListCompany";
import { HttpMethod, IRoute } from "../IRoute";
import { PlanType, StatusType } from "../../../domain/entities/company/Company";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { UserProps } from "../../../domain/entities/user/User";
export type ListCompanyResponseDto = {
  companies: {
    id: string;
    name: string;
    cnpj?: string;
    ie?: string;
    email?: string;
    phone?: string;
    responsibleName?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    website?: string;
    segment?: string;
    notes?: string;

    photo?: string;
    photoPublicId?: string;

    plan: PlanType;
    status: StatusType;
    accessExpiresAt: Date;
    createdAt: Date;
    maxConcurrentEvents: number;
    users: UserProps[];
  }[];
};

export class ListCompanyRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listCompanyServer: ListCompany,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    listCompanyServer: ListCompany,
    authorization: AuthorizationRoute
  ) {
    return new ListCompanyRoute(
      "/companies",
      HttpMethod.GET,
      listCompanyServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const search = request.query.search as string | undefined;
      const output = await this.listCompanyServer.execute({
        search: typeof search === "string" ? search.trim() : undefined,
      });
      const result = {
        companies: output.companies.map((company) => ({
          id: company.id,
          name: company.name,
          cnpj: company.cnpj,
          ie: company.ie,
          email: company.email,
          phone: company.phone,
          responsibleName: company.responsibleName,
          address: company.address,
          city: company.city,
          state: company.state,
          zipCode: company.zipCode,
          website: company.website,
          segment: company.segment,
          notes: company.notes,
          photo: company.photo,
          status: company.status,
          accessExpiresAt: company.accessExpiresAt,
          createdAt: company.createdAt,
          users: company.users as UserProps[],
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
    return [this.authorization.adminRoute];
  }
}
