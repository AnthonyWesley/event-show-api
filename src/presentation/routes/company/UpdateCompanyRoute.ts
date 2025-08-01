import { Request, Response } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { PlanType } from "../../../domain/entities/company/Company";
import {
  UpdateCompany,
  UpdateCompanyInputDto,
  UpdateCompanyOutputDto,
} from "../../../usecase/company/UpdateCompany";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

export type UpdateCompanyResponseDto = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: PlanType;
};

export class UpdateCompanyRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateCompanyService: UpdateCompany,
    private readonly authorization: AuthorizationRoute
  ) {}

  static create(
    updateCompanyService: UpdateCompany,
    authorization: AuthorizationRoute
  ) {
    return new UpdateCompanyRoute(
      "/companies/:id",
      HttpMethod.PATCH,
      updateCompanyService,
      authorization
    );
  }

  getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { id } = request.params;
      const {
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
        maxConcurrentEvents,
      } = request.body;

      const input: UpdateCompanyInputDto = {
        id,
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
        maxConcurrentEvents,
      };

      const output: UpdateCompanyOutputDto =
        await this.updateCompanyService.execute(input);

      const result = { id: output.id };
      response.status(200).json(result);
    };
  }

  getPath(): string {
    return this.path;
  }

  getMethod(): HttpMethod {
    return this.method;
  }

  public getMiddlewares() {
    return [this.authorization.userRoute];
  }
}
