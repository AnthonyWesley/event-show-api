import { ICompanyGateway } from "../../domain/entities/company/ICompanyGateway";
import { PlanType, Company } from "../../domain/entities/company/Company";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";
import { ValidationError } from "../../shared/errors/ValidationError";
import { IUseCases } from "../IUseCases";
import { IUserGateway } from "../../domain/entities/user/IUserGateway";

import { NotFoundError } from "../../shared/errors/NotFoundError";
import { AuthTokenService } from "../../service/AuthTokenService";

export type CreateCompanyInputDto = {
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  plan: PlanType;

  cnpj?: string;
  ie?: string;
  responsibleName?: string;
  address?: string;
  city?: string;
  state?: string;
  platformId: string;
  zipCode?: string;
  website?: string;
  segment?: string;
  notes?: string;
  photo?: string;
  photoPublicId?: string;
};

export type CreateCompanyOutputDto = {
  accessToken: string;
  companyId: string;
};

export class CreateCompany
  implements IUseCases<CreateCompanyInputDto, CreateCompanyOutputDto>
{
  private constructor(
    private readonly companyGateway: ICompanyGateway,
    private readonly userGateway: IUserGateway,
    private readonly authorization: AuthTokenService
  ) {}

  public static create(
    companyGateway: ICompanyGateway,
    userGateway: IUserGateway,
    authorization: AuthTokenService
  ) {
    return new CreateCompany(companyGateway, userGateway, authorization);
  }

  public async execute(
    input: CreateCompanyInputDto
  ): Promise<CreateCompanyOutputDto> {
    if (!input.name) {
      throw new ValidationError("Name are required.");
    }
    const user = await this.userGateway.findById(input.userId ?? "");
    if (!user) {
      throw new NotFoundError("User");
    }

    const companyAlreadyExists = await this.companyGateway.findByEmail(
      input.email
    );
    if (companyAlreadyExists) {
      throw new UnauthorizedError("E-mail da empresa já está em uso.");
    }

    const aCompany = await Company.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      cnpj: input.cnpj,
      ie: input.ie,
      responsibleName: input.responsibleName,
      address: input.address,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
      website: input.website,
      segment: input.segment,
      platformId: input.platformId,
      notes: input.notes,
      photo: input.photo,
      photoPublicId: input.photoPublicId,
    });

    await this.companyGateway.save(aCompany, user.id);

    const accessToken = this.authorization.generateToken(
      {
        id: user.id,
        email: user.email,
        companyId: aCompany.id,
      },
      "1d"
    );

    return { accessToken, companyId: aCompany.id };
  }
}
