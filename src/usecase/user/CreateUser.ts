import { CompanyProps } from "../../domain/entities/company/Company";
import { IUserGateway } from "../../domain/entities/user/IUserGateway";
import { User, UserRole } from "../../domain/entities/user/User";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";
import { ValidationError } from "../../shared/errors/ValidationError";
import { IUseCases } from "../IUseCases";

export type CreateUserInputDto = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: UserRole;
  companyId?: string;
  company?: Partial<CompanyProps>;
};

export type CreateUserOutputDto = {
  id: string;
};

export class CreateUser
  implements IUseCases<CreateUserInputDto, CreateUserOutputDto>
{
  private constructor(private readonly userGateway: IUserGateway) {}

  public static create(userGateway: IUserGateway) {
    return new CreateUser(userGateway);
  }

  public async execute(
    input: CreateUserInputDto
  ): Promise<CreateUserOutputDto> {
    if (!input.name || !input.email || !input.password) {
      throw new ValidationError("All fields are required: name, email, plan.");
    }

    const existUser = await this.userGateway.findByEmail(input.email);
    if (existUser) {
      throw new UnauthorizedError("E-mail already exist.");
    }

    const aUser = await User.create(
      input.name,
      input.email,
      input.password,
      input.phone,
      // input.role,
      input.companyId,
      input.company
    );

    await this.userGateway.save(aUser);

    return { id: aUser.id };
  }
}
