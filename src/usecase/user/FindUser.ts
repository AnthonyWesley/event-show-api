import { CompanyProps, PlanType } from "../../domain/entities/company/Company";
import { IUserGateway } from "../../domain/entities/user/IUserGateway";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { IUseCases } from "../IUseCases";

export type FindUserInputDto = { id: string };
export type CompanyDto = CompanyProps & {
  maxConcurrentEvents: number;
};
export type FindUserOutputDto = {
  id: string;
  name: string;
  cpf?: string;
  email: string;
  phone?: string;
  photo?: string;
  photoPublicId?: string;
  role: string;
  createdAt: Date;
  companyId?: string;
  company?: {
    id: string;
    name: string;
    phone?: string;
    photo?: string;
    photoPublicId?: string;
    plan: PlanType;
    status: string;
    maxConcurrentEvents?: number;
    accessExpiresAt: Date;
    createdAt: Date;
  };
};
export class FindUser
  implements IUseCases<FindUserInputDto, FindUserOutputDto>
{
  private constructor(private readonly userGateway: IUserGateway) {}

  public static create(userGateway: IUserGateway) {
    return new FindUser(userGateway);
  }

  public async execute(input: FindUserInputDto): Promise<FindUserOutputDto> {
    const user = await this.userGateway.findById(input.id);
    if (!user) throw new NotFoundError("User");
    const company: any = user.company;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      photo: user.photo,
      photoPublicId: user.photoPublicId,
      role: user.role,
      createdAt: user.createdAt,
      companyId: user.companyId,
      company: company
        ? {
            id: company.id ?? "",
            name: company.name ?? "",
            phone: company.phone ?? undefined,
            photo: company.photo ?? undefined,
            photoPublicId: company.photoPublicId ?? undefined,
            plan: company.plan ?? "TEST",
            status: String(company.status ?? "ACTIVE"),
            maxConcurrentEvents:
              typeof company.maxConcurrentEvents === "number"
                ? company.maxConcurrentEvents
                : 1,
            accessExpiresAt: company.accessExpiresAt ?? new Date(),
            createdAt: company.createdAt ?? new Date(),
          }
        : undefined,
    };
  }
}
