import bcrypt from "bcryptjs";
import { IUseCases } from "../IUseCases";
import { EventProps, Goal } from "../../domain/entities/event/Event";
import { StatusType } from "../../domain/entities/company/Company";
import { Authorization } from "../../infra/http/middlewares/Authorization";
import { ProductProps } from "../../domain/entities/product/Product";
import { ValidationError } from "../../shared/errors/ValidationError";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";
import { IUserGateway } from "../../domain/entities/user/IUserGateway";
import { company } from "../../infra/Container";

export type LoginUserInputDto = {
  email: string;
  password: string;
};

export type CompanyDto = {
  id: string;
  name: string;
  email: string;
  plan: any;
  photo?: string;
  photoPublicId?: string;
  status: StatusType;
  refreshToken: string;
  products: ProductProps[];
  events: EventProps[];
  accessExpiresAt: Date;
  createdAt: Date;
};

export type TokenType = {
  accessToken: string;
  refreshToken: string;
};

export type SellerDto = {
  id: string;
  name: string;
  email: string;
};

export type EventWithSellersDto = {
  id: string;
  name: string;
  goal: number;
  goalType: Goal;
  startDate: Date;
  sellers: SellerDto[];
};

export type LoginUserOutputDto = {
  token: TokenType;
};

export class LoginUser
  implements IUseCases<LoginUserInputDto, LoginUserOutputDto>
{
  private constructor(
    private readonly userGateway: IUserGateway,
    private readonly authorization: Authorization
  ) {}

  static create(userGateway: IUserGateway, authorization: Authorization) {
    return new LoginUser(userGateway, authorization);
  }

  async execute(input: LoginUserInputDto): Promise<LoginUserOutputDto> {
    if (!input.email || !input.password) {
      throw new ValidationError("All fields are required: email, password.");
    }

    const user = await this.userGateway.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    const accessToken = this.authorization.generateToken(
      { id: user.id, email: user.email, companyId: user.companyId },
      "1d"
    );
    const refreshToken = this.authorization.generateToken(
      { id: user.id },
      "7d"
    );

    user.setRefreshToken(refreshToken);
    this.userGateway.updateRefreshToken(user.id, refreshToken);

    const token: TokenType = { accessToken, refreshToken };

    return {
      token,
    };
  }
}
