import { IUseCases } from "../IUseCases";
import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { Authorization } from "../../infra/http/middlewares/Authorization";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";
import { IUserGateway } from "../../domain/entities/user/IUserGateway";

type Input = { userId: string; adminId: string };
type Output = { accessToken: string };

export class ImpersonateCompany implements IUseCases<Input, Output> {
  private constructor(
    private readonly userGateway: IUserGateway,
    private readonly companyGateway: ICompanyGateway,
    private readonly authorization: Authorization
  ) {}

  static create(
    userGateway: IUserGateway,
    companyGateway: ICompanyGateway,
    authorization: Authorization
  ) {
    return new ImpersonateCompany(userGateway, companyGateway, authorization);
  }

  async execute(input: Input): Promise<Output> {
    const user = await this.userGateway.findById(input.userId);

    if (!user) throw new UnauthorizedError("User not found");

    const token = this.authorization.generateToken(
      {
        id: user.id,
        email: user.email,
        companyId: user.companyId,
        role: "user",
        impersonatedBy: input.adminId,
      },
      "1d"
    );

    return { accessToken: token };
  }
}
