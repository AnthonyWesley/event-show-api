import { Response, Request } from "express";
import { IRoute, HttpMethod } from "../IRoute";
import {
  CreatePartner,
  CreatePartnerInputDto,
} from "../../../usecase/partner/CreatePartner";

export type CreatePartnerResponseDto = {
  id: string;
};

export class CreatePartnerRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createPartnerService: CreatePartner
  ) {}

  public static create(createPartnerService: CreatePartner) {
    return new CreatePartnerRoute(
      "/auth/register",
      HttpMethod.POST,
      createPartnerService
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { name, email, password, plan, phone } = request.body;

      const input: CreatePartnerInputDto = {
        name,
        email,
        password,
        phone,
        plan,
      };

      const output: CreatePartnerResponseDto =
        await this.createPartnerService.execute(input);

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
}
