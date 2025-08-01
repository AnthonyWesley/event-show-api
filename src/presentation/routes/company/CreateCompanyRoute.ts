import { Response, Request } from "express";
import { IRoute, HttpMethod } from "../IRoute";
import {
  CreateCompany,
  CreateCompanyInputDto,
} from "../../../usecase/company/CreateCompany";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

export type CreateCompanyResponseDto = {
  accessToken: string;
  companyId: string;
};

export class CreateCompanyRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createCompanyService: CreateCompany,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    createCompanyService: CreateCompany,
    authorization: AuthorizationRoute
  ) {
    return new CreateCompanyRoute(
      "/companies",
      HttpMethod.POST,
      createCompanyService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { user } = request as any;
      const {
        name,
        email,
        phone,
        plan,
        cnpj,
        platformId,
        ie,
        responsibleName,
        address,
        city,
        state,
        zipCode,
        website,
        segment,
        notes,
        photo,
        photoPublicId,
      } = request.body;

      const input: CreateCompanyInputDto = {
        userId: user.id,
        name,
        email,
        phone,
        plan,
        cnpj,
        ie,
        responsibleName,
        address,
        city,
        state,
        zipCode,
        website,
        segment,
        notes,
        photo,
        photoPublicId,
        platformId,
      };

      const output: CreateCompanyResponseDto =
        await this.createCompanyService.execute(input);

      response
        .status(201)
        .json({ token: output.accessToken, companyId: output.companyId });
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
