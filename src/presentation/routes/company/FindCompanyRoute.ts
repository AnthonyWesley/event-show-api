import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { Goal } from "../../../domain/entities/event/Event";
import { FindCompany } from "../../../usecase/company/FindCompany";

export class FindCompanyRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findCompanyServer: FindCompany,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    findCompanyServer: FindCompany,
    authorization: AuthorizationRoute
  ) {
    return new FindCompanyRoute(
      "/company",
      HttpMethod.GET,
      findCompanyServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { user } = request as any;

      const output = await this.findCompanyServer.execute({
        id: user.companyId,
      });

      const result = {
        id: output.id,
        name: output.name,
        cnpj: output.cnpj,
        ie: output.ie,
        email: output.email,
        phone: output.phone,
        responsibleName: output.responsibleName,
        address: output.address,
        city: output.city,
        state: output.state,
        zipCode: output.zipCode,
        website: output.website,
        segment: output.segment,
        notes: output.notes,

        photo: output.photo,
        photoPublicId: output.photoPublicId,

        planId: output.planId,
        status: output.status,
        accessExpiresAt: output.accessExpiresAt,
        createdAt: output.createdAt,
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
