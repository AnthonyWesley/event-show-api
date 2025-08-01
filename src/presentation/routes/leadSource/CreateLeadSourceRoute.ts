import { Request, Response } from "express";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { HttpMethod, IRoute } from "../IRoute";

import {
  CreateLeadSource,
  CreateLeadSourceInputDto,
} from "../../../usecase/leadSource/CreateLeadSource";

export type CreateLeadSourceRouteResponseDto = {
  id: string;
};

export class CreateLeadSourceRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createLeadSourceRouteService: CreateLeadSource,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    createLeadSourceRouteService: CreateLeadSource,
    authorization: AuthorizationRoute
  ) {
    return new CreateLeadSourceRoute(
      "/sources",
      HttpMethod.POST,
      createLeadSourceRouteService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { user } = request as any;
      const { name, description } = request.body;

      const input: CreateLeadSourceInputDto = {
        name,
        description,
        companyId: user.companyId,
      };

      const output: CreateLeadSourceRouteResponseDto =
        await this.createLeadSourceRouteService.execute(input);
      const result = { id: output.id };

      response.status(201).json(result);
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
