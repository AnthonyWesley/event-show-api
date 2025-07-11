import { IUserGateway } from "../../domain/entities/user/IUserGateway";
import { ValidationError } from "../../shared/errors/ValidationError";
import { IUseCases } from "../IUseCases";

export type DeleteUserInputDto = {
  id: string;
};

export class DeleteUser implements IUseCases<DeleteUserInputDto, void> {
  private constructor(readonly userGateway: IUserGateway) {}

  static create(userGateway: IUserGateway) {
    return new DeleteUser(userGateway);
  }

  async execute({ id }: DeleteUserInputDto): Promise<void> {
    if (!id) {
      throw new ValidationError("Id is required.");
    }
    await this.userGateway.delete(id);
  }
}
