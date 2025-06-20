import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { Authorization } from "../../../infra/http/middlewares/Authorization";
import {
  FindPartnerEvent,
  FindPartnerEventOutputDto,
} from "../../../usecase/event/FindPartnerEvent";
import { Goal } from "../../../domain/entities/event/Event";

export type FindPartnerEventResponseDto = {
  id: string;
  name: string;
  photo?: string;
  photoPublicId?: string;
  file?: any;
  startDate: Date;
  endDate: Date;
  goal: number;
  isActive: boolean;
  goalType: Goal;
  partnerId: string;
  createdAt: Date;
};

export class FindPartnerEventRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findPartnerEventServer: FindPartnerEvent,
    private readonly authorization: Authorization
  ) {}

  public static create(
    findPartnerEventServer: FindPartnerEvent,
    authorization: Authorization
  ) {
    return new FindPartnerEventRoute(
      "/events/:eventId",
      HttpMethod.GET,
      findPartnerEventServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { partner } = request as any;
      const { eventId } = request.params;
      const input = { partnerId: partner.id, eventId };
      const output: FindPartnerEventOutputDto =
        await this.findPartnerEventServer.execute(input);
      const result = {
        id: output.id,
        name: output.name,
        startDate: output.startDate,
        endDate: output.endDate,
        goal: output.goal,
        goalType: output.goalType,
        partnerId: output.partnerId,
        sales: output.sales,
        isActive: output.isActive,
        allSellers: output.allSellers,

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
