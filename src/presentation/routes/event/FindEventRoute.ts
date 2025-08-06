import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";

import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import {
  FindEvent,
  FindEventOutputDto,
} from "../../../usecase/event/FindEvent";
import { Goal } from "../../../domain/entities/event/Event";

export type FindEventResponseDto = {
  id: string;
  name: string;
  photo?: string;
  file?: any;
  startDate: Date;
  endDate: Date;
  goal: number;
  isActive: boolean;
  goalType: Goal;
  companyId: string;
  createdAt: Date;
};

export class FindEventRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly findEventServer: FindEvent,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    findEventServer: FindEvent,
    authorization: AuthorizationRoute
  ) {
    return new FindEventRoute(
      "/events/:eventId",
      HttpMethod.GET,
      findEventServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { user } = request as any;
      const { eventId } = request.params;
      const input = { companyId: user.companyId, eventId };
      const output: FindEventOutputDto = await this.findEventServer.execute(
        input
      );
      const result = {
        id: output.id,
        name: output.name,
        photo: output.photo,
        startDate: output.startDate,
        endDate: output.endDate,
        goal: output.goal,
        goalType: output.goalType,
        companyId: output.companyId,
        sales: output.sales,
        isActive: output.isActive,
        isValueVisible: output.isValueVisible,
        goalMode: output.goalMode,
        totalSalesValue: output.totalSalesValue,
        totalUnitsSold: output.totalUnitsSold,
        allSellers: output.allSellers,
        leads: output.leads,

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
