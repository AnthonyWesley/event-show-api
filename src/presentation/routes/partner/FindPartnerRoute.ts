import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { Authorization } from "../../../infra/http/middlewares/Authorization";

import { Goal } from "../../../domain/entities/event/Event";
import { FindPartner } from "../../../usecase/partner/FindPartner";

export type FindPartnerResponseDto = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  goal: number;
  photo: string;
  photoPublicId: string;
  goalType: Goal;
  partnerId: string;
  createdAt: Date;
};

export class FindPartnerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findPartnerServer: FindPartner,
    private readonly authorization: Authorization
  ) {}

  public static create(
    findPartnerServer: FindPartner,
    authorization: Authorization
  ) {
    return new FindPartnerRoute(
      "/auth/me",
      HttpMethod.GET,
      findPartnerServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { partner } = request as any;

      const output = await this.findPartnerServer.execute(partner);

      const result = {
        id: output.id,
        name: output.name,
        phone: output.phone,
        photo: output.photo,
        photoPublicId: output.photoPublicId,
        email: output.email,
        plan: output.plan,
        status: output.status,
        maxConcurrentEvents: output.maxConcurrentEvents,
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
    return [this.authorization.authorizationRoute];
  }
}
