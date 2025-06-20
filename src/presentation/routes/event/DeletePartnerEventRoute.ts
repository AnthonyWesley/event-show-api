import { Response, Request } from "express";
import {
  DeletePartnerEvent,
  DeletePartnerEventInputDto,
} from "../../../usecase/event/DeletePartnerEvent";
import { HttpMethod, IRoute } from "../IRoute";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export type DeletePartnerEventResponseDto = {
  id: string;
};
export class DeletePartnerEventRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deletePartnerEventService: DeletePartnerEvent,
    private readonly authorization: Authorization
  ) {}

  static create(
    deletePartnerEventService: DeletePartnerEvent,
    authorization: Authorization
  ) {
    return new DeletePartnerEventRoute(
      "/events/:eventId",
      HttpMethod.DELETE,
      deletePartnerEventService,
      authorization
    );
  }
  getHandler() {
    return async (request: Request, response: Response) => {
      const { eventId } = request.params;
      const { partner } = request as any;

      const input: DeletePartnerEventInputDto = {
        partnerId: partner.id,
        eventId,
      };

      await this.deletePartnerEventService.execute(input);

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
    return [this.authorization.authorizationRoute];
  }
}
