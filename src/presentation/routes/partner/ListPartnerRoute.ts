import { Response, Request } from "express";
import {
  ListPartner,
  ListPartnerOutputDto,
} from "../../../usecase/partner/ListPartner";
import { HttpMethod, IRoute } from "../IRoute";
import { PlanType, StatusType } from "../../../domain/entities/partner/Partner";
import { EventProps } from "../../../domain/entities/event/Event";
import { Authorization } from "../../../infra/http/middlewares/Authorization";

export type ListPartnerResponseDto = {
  partners: {
    id: string;
    name: string;
    email: string;
    phone: string;
    plan: PlanType;
    status: StatusType;
    events: EventProps[];

    trialEndsAt: Date;
    createdAt: Date;
  }[];
};

export class ListPartnerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listPartnerServer: ListPartner,
    private readonly authorization: Authorization
  ) {}

  public static create(
    listPartnerServer: ListPartner,
    authorization: Authorization
  ) {
    return new ListPartnerRoute(
      "/partners",
      HttpMethod.GET,
      listPartnerServer,
      authorization
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      const output: ListPartnerOutputDto =
        await this.listPartnerServer.execute();

      const result = {
        partners: output.partners.map((partner) => ({
          id: partner.id,
          name: partner.name,
          email: partner.email,
          phone: partner.phone,
          password: partner.password,
          plan: partner.plan,
          status: partner.status,
          events: partner.events,
          maxConcurrentEvents: partner.maxConcurrentEvents,
          trialEndsAt: partner.trialEndsAt,
          createdAt: partner.createdAt,
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
    return this.authorization.adminAuthorizationRoute;
  }
}
