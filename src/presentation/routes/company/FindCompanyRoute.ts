import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";
import { Goal } from "../../../domain/entities/event/Event";
import { FindCompany } from "../../../usecase/company/FindCompany";

export type FindCompanyResponseDto = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  goal: number;
  photo: string;
  photoPublicId: string;
  goalType: Goal;
  companyId: string;
  createdAt: Date;
};

export class FindCompanyRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findCompanyServer: FindCompany,
    private readonly authorization: Authorization
  ) {}

  public static create(
    findCompanyServer: FindCompany,
    authorization: Authorization
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

        plan: output.plan,
        status: output.status,
        accessExpiresAt: output.accessExpiresAt,
        createdAt: output.createdAt,
        maxConcurrentEvents: output.maxConcurrentEvents,
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
    return [this.authorization.authorizationRoute];
  }
}
