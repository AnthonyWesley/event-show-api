import { Response, Request } from "express";
import {
  DeleteEvent,
  DeleteEventInputDto,
} from "../../../usecase/event/DeleteEvent";
import { HttpMethod, IRoute } from "../IRoute";
import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";

export type DeleteEventResponseDto = {
  id: string;
};
export class DeleteEventRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deleteEventService: DeleteEvent,
    private readonly authorization: AuthorizationRoute
  ) {}

  static create(
    deleteEventService: DeleteEvent,
    authorization: AuthorizationRoute
  ) {
    return new DeleteEventRoute(
      "/events/:eventId",
      HttpMethod.DELETE,
      deleteEventService,
      authorization
    );
  }
  getHandler() {
    return async (request: Request, response: Response) => {
      const { eventId } = request.params;
      const { user } = request as any;

      const input: DeleteEventInputDto = {
        companyId: user.companyId,
        eventId,
      };

      await this.deleteEventService.execute(input);

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
    return [this.authorization.userRoute];
  }
}
