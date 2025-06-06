import { Response, Request } from "express";
import { IRoute, HttpMethod } from "../IRoute";
import {
  CreatePartner,
  CreatePartnerInputDto,
} from "../../../usecase/partner/CreatePartner";
import {
  CreateAdmin,
  CreateAdminInputDto,
} from "../../../usecase/adm/CreateAdmin";

export type CreateAdminResponseDto = {
  id: string;
};

export class CreateAdminRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createAdminService: CreateAdmin
  ) {}

  public static create(createAdminService: CreateAdmin) {
    return new CreateAdminRoute(
      "/admin/register",
      HttpMethod.POST,
      createAdminService
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { email, password } = request.body;

      const input: CreateAdminInputDto = {
        email,
        password,
      };

      const output: CreateAdminResponseDto =
        await this.createAdminService.execute(input);

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
