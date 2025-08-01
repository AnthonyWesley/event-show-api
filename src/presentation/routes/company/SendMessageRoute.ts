import { Response, Request } from "express";
import { IRoute, HttpMethod } from "../IRoute";

import { AuthorizationRoute } from "../../../infra/http/middlewares/AuthorizationRoute";
import {
  SendMessage,
  SendMessageInputDto,
} from "../../../usecase/company/SendMessage";

export type SendMessageResponseDto = {
  message: string;
};

export class CreateCompanyRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly sendMessageService: SendMessage,
    private readonly authorization: AuthorizationRoute
  ) {}

  public static create(
    sendMessageService: SendMessage,
    authorization: AuthorizationRoute
  ) {
    return new CreateCompanyRoute(
      "/companies/message",
      HttpMethod.POST,
      sendMessageService,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { user } = request as any;
      const { message } = request.body;

      const input: SendMessageInputDto = {
        companyId: user.id,
        message,
      };

      const output: SendMessageResponseDto =
        await this.sendMessageService.execute(input);

      response.status(201).json({ message: output.message });
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
