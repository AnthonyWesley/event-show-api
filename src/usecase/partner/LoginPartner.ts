import bcrypt from "bcryptjs";
import { IPartnerGateway } from "../../domain/entities/partner/IPartnerGateway";
import { IUseCases } from "../IUseCases";
import { EventProps, Goal } from "../../domain/entities/event/Event";
import { StatusType } from "../../domain/entities/partner/Partner";
import { Authorization } from "../../infra/http/middlewares/Authorization";
import { ProductProps } from "../../domain/entities/product/Product";
import { ValidationError } from "../../shared/errors/ValidationError";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";

export type LoginInputDto = {
  email: string;
  password: string;
};

export type PartnerDto = {
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

export type LoginOutputDto = {
  token: TokenType;
};

export class LoginPartner implements IUseCases<LoginInputDto, LoginOutputDto> {
  private constructor(
    private readonly partnerGateway: IPartnerGateway,
    private readonly authorization: Authorization
  ) {}

  static create(partnerGateway: IPartnerGateway, authorization: Authorization) {
    return new LoginPartner(partnerGateway, authorization);
  }

  async execute(input: LoginInputDto): Promise<LoginOutputDto> {
    if (!input.email || !input.password) {
      throw new ValidationError("All fields are required: email, password.");
    }

    const partner = await this.partnerGateway.findByEmail(input.email);
    if (!partner) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(
      input.password,
      partner.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    const accessToken = this.authorization.generateToken(
      { id: partner.id, email: partner.email },
      "1d"
    );
    const refreshToken = this.authorization.generateToken(
      { id: partner.id },
      "7d"
    );

    partner.setRefreshToken(refreshToken);
    this.partnerGateway.updateRefreshToken(partner.id, refreshToken);

    const token: TokenType = { accessToken, refreshToken };

    return {
      token,
    };
  }
}
