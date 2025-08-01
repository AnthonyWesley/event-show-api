import { Request, Response } from "express";
import {
  DeleteCompany,
  DeleteCompanyInputDto,
} from "../../../usecase/company/DeleteCompany";
import { IRoute, HttpMethod } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

export type DeleteCompanyResponseDto = {
  id: string;
};
export class DeleteCompanyRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deleteCompanyService: DeleteCompany,
    private readonly authorization: AuthorizationRoute
  ) {}

  static create(
    deleteCompanyService: DeleteCompany,
    authorization: AuthorizationRoute
  ) {
    return new DeleteCompanyRoute(
      "/companies/:id",
      HttpMethod.DELETE,
      deleteCompanyService,
      authorization
    );
  }
  getHandler() {
    return async (request: Request, response: Response) => {
      const { id } = request.params;

      const input: DeleteCompanyInputDto = { id };

      await this.deleteCompanyService.execute(input);

      response.status(201).json();
    };
  }

  getPath(): string {
    return this.path;
  }

  getMethod(): HttpMethod {
    return this.method;
  }

  public getMiddlewares() {
    return [this.authorization.adminRoute];
  }
}
