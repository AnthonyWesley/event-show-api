import { Response, Request } from "express";
import { HttpMethod, IRoute } from "../IRoute";
import { ListEvent } from "../../../usecase/event/ListEvent";
import { Authorization } from "../../../infra/http/middlewares/Authorization";
import { Goal } from "../../../domain/entities/event/Event";

export type ListEventResponseDto = {
  Events: {
    id: string;
    name: string;
    photo?: string;
    photoPublicId?: string;
    file?: any;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    goal: number;
    goalType: Goal;
    companyId: string;
    createdAt: Date;
  }[];
};

export class ListEventRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listEventServer: ListEvent,
    private readonly authorization: Authorization
  ) {}

  public static create(
    listEventServer: ListEvent,
    authorization: Authorization
  ) {
    return new ListEventRoute(
      "/events",
      HttpMethod.GET,
      listEventServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const { user } = request as any;
      const search = request.query.search as string | undefined;
      const output = await this.listEventServer.execute({
        companyId: user.companyId,
        search: typeof search === "string" ? search.trim() : undefined,
      });

      const result = {
        events: output.events.map((event) => ({
          id: event.id,
          name: event.name,
          photo: event.photo,
          photoPublicId: event.photoPublicId,
          startDate: event.startDate,
          endDate: event.endDate,
          goal: event.goal,
          goalType: event.goalType,
          companyId: event.companyId,
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
    return [this.authorization.authorizationRoute];
  }
}
