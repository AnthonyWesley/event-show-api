import { CreateAdmin } from "../../usecase/admin/CreateAdmin";
import { ImpersonateCompany } from "../../usecase/admin/ImpersonateCompany";
import { LoginAdmin } from "../../usecase/admin/LoginAdmin";
import { LogoutAdmin } from "../../usecase/admin/LogoutAdmin";
import { RefreshAdmin } from "../../usecase/admin/RefreshAdmin";
import { Authorization } from "../http/middlewares/Authorization";
import { AdminRepositoryPrisma } from "../repositories/admin/AdminRepositoryPrisma";
import { CompanyRepositoryPrisma } from "../repositories/company/CompanyRepositoryPrisma";
import { UserRepositoryPrisma } from "../repositories/user/UserRepositoryPrisma";

export function makeAdminUseCases(
  adminRepository: AdminRepositoryPrisma,
  userRepository: UserRepositoryPrisma,
  authorization: Authorization,
  companyRepository: CompanyRepositoryPrisma
) {
  return {
    login: LoginAdmin.create(adminRepository, authorization),
    create: CreateAdmin.create(adminRepository),
    impersonate: ImpersonateCompany.create(
      userRepository,
      companyRepository,
      authorization
    ),
    logout: LogoutAdmin.create(adminRepository, authorization),
    refresh: RefreshAdmin.create(adminRepository, authorization),
  };
}
