import { Request, Response } from "express";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import { HttpMethod, IRoute } from "../IRoute";
import {
  CreateLead,
  CreateLeadInputDto,
} from "../../../usecase/lead/CreateLead";

export type CreateLeadRouteResponseDto = {
  id: string;
};

export class CreateLeadRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createLeadRouteService: CreateLead,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    createLeadRouteService: CreateLead,
    authorization: AuthorizationRoute
  ) {
    return new CreateLeadRoute(
      "/events/:eventId/leads",
      HttpMethod.POST,
      createLeadRouteService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { user } = request as any;
      const { eventId } = request.params;
      const {
        name,
        products,
        customInterest,
        notes,
        sellerId,
        leadSourceId,
        phone,
        customValues,
        wasPresent,
      } = request.body;

      const input: CreateLeadInputDto = {
        name,
        phone,
        products,
        customInterest,
        notes,
        eventId,
        companyId: user.companyId,
        leadSourceId,
        sellerId,
        customValues,
        wasPresent,
      };

      const output: CreateLeadRouteResponseDto =
        await this.createLeadRouteService.execute(input);
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
