import { IUserGateway } from "../../domain/entities/user/IUserGateway";
import { PlanType, StatusType } from "../../domain/entities/company/Company";
import { IUseCases } from "../IUseCases";

export type ListUsersInputDto = {
  search?: string;
};

export type ListUsersOutputDto = {
  users: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    photo?: string;
    photoPublicId?: string;
    role: string;
    companyId?: string;
    createdAt: Date;

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
  }[];
};

export class ListUsers
  implements IUseCases<ListUsersInputDto, ListUsersOutputDto>
{
  private constructor(private readonly userGateway: IUserGateway) {}

  public static create(userGateway: IUserGateway) {
    return new ListUsers(userGateway);
  }

  public async execute(input: ListUsersInputDto): Promise<ListUsersOutputDto> {
    const users = await this.userGateway.list(input.search);
    if (!users) throw new Error("Failed to list users");

    return {
      users: users.map((u) => {
        const company: any = u.company;

        return {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone ?? undefined,
          photo: u.photo ?? undefined,
          photoPublicId: u.photoPublicId ?? undefined,
          role: String(u.role),
          createdAt: u.createdAt,
          companyId: u.companyId,
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
      }),
    };
  }
}
