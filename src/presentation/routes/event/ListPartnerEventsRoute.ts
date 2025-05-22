import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import {
  ListPartnerEvent,
  ListPartnerEventOutputDto,
} from "../../../usecase/event/ListPartnerEvent";
import { Authorization } from "../../../infra/http/middlewares/Authorization";
import { Goal } from "../../../domain/entities/event/Event";

export type ListPartnerEventResponseDto = {
  Events: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    goal: number;
    goalType: Goal;
    partnerId: string;
    createdAt: Date;
  }[];
};

export class ListPartnerEventRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listPartnerEventServer: ListPartnerEvent,
    private readonly authorization: Authorization
  ) {}

  public static create(
    listPartnerEventServer: ListPartnerEvent,
    authorization: Authorization
  ) {
    return new ListPartnerEventRoute(
      "/events",
      HttpMethod.GET,
      listPartnerEventServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      // const { partnerId } = request.params;
      const { partner } = request as any;

      const output: ListPartnerEventOutputDto =
        await this.listPartnerEventServer.execute({ partnerId: partner.id });

      const result = {
        events: output.events.map((event) => ({
          id: event.id,
          name: event.name,
          startDate: event.startDate,
          endDate: event.endDate,
          goal: event.goal,
          goalType: event.goalType,
          partnerId: event.partnerId,
          allSellers: event.allSellers,
          isActive: event.isActive,
          sales: event.sales,
          createdAt: event.createdAt,
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
    return this.authorization.authorizationRoute;
  }
}
