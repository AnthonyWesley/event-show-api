import { Admin } from "../../domain/entities/admin/Admin";
import { IAdminGateway } from "../../domain/entities/admin/IAdminGateway";

import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";
import { ValidationError } from "../../shared/errors/ValidationError";
import { IUseCases } from "../IUseCases";

export type CreateAdminInputDto = {
  email: string;
  password: string;
};

export type CreateAdminOutputDto = {
  id: string;
};

export class CreateAdmin
  implements IUseCases<CreateAdminInputDto, CreateAdminOutputDto>
{
  private constructor(private readonly adminGateway: IAdminGateway) {}

  public static create(adminGateway: IAdminGateway) {
    return new CreateAdmin(adminGateway);
  }

  public async execute(
    input: CreateAdminInputDto
  ): Promise<CreateAdminOutputDto> {
    if (!input.email || !input.password) {
      throw new ValidationError("All fields are required: email, password.");
    }

    const existAdmin = await this.adminGateway.findByEmail(input.email);
    if (existAdmin) {
      throw new UnauthorizedError("E-mail already exist.");
    }

    const aAdmin = await Admin.create(input.email, input.password);

    await this.adminGateway.save(aAdmin);

    return { id: aAdmin.id };
  }
}
