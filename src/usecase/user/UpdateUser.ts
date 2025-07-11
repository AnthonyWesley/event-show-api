import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";
import { IUserGateway } from "../../domain/entities/user/IUserGateway";
import { User, UserRole } from "../../domain/entities/user/User";
import { Authorization } from "../../infra/http/middlewares/Authorization";

export type UpdateUserInputDto = {
  id: string;
  name: string;
  cpf?: string;
  email: string;
  phone?: string;
  photo?: string;
  photoPublicId?: string;
  role: UserRole;
  createdAt?: Date;
  companyId?: string;
};

export type UpdateUserOutputDto = {
  id: string;
};

export class UpdateUser
  implements IUseCases<UpdateUserInputDto, UpdateUserOutputDto>
{
  private constructor(
    private readonly userGateway: IUserGateway,
    private readonly authorization: Authorization
  ) {}

  static create(userGateway: IUserGateway, authorization: Authorization) {
    return new UpdateUser(userGateway, authorization);
  }

  async execute(input: UpdateUserInputDto): Promise<UpdateUserOutputDto> {
    const existingUser = await this.userGateway.findById(input.id);
    if (!existingUser) {
      throw new NotFoundError("User");
    }

    const user = User.with({
      id: existingUser.id,
      name: input.name,
      email: input.email,
      password: existingUser.password,
      phone: input.phone,
      photo: input.photo,
      photoPublicId: existingUser.photoPublicId,
      role: input.role,
      createdAt: existingUser.createdAt,
      companyId: input.companyId ?? "",
    });

    await this.userGateway.update(user.id, user);

    return { id: user.id };
  }
}
