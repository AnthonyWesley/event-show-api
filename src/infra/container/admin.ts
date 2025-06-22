import { CreateAdmin } from "../../usecase/admin/CreateAdmin";
import { ImpersonatePartner } from "../../usecase/admin/ImpersonatePartner";
import { LoginAdmin } from "../../usecase/admin/LoginAdmin";
import { LogoutAdmin } from "../../usecase/admin/LogoutAdmin";
import { RefreshAdmin } from "../../usecase/admin/RefreshAdmin";
import { Authorization } from "../http/middlewares/Authorization";
import { AdminRepositoryPrisma } from "../repositories/admin/AdminRepositoryPrisma";
import { PartnerRepositoryPrisma } from "../repositories/partner/PartnerRepositoryPrisma";

export function makeAdminUseCases(
  adminRepository: AdminRepositoryPrisma,
  authorization: Authorization,
  partnerRepository: PartnerRepositoryPrisma
) {
  return {
    login: LoginAdmin.create(adminRepository, authorization),
    create: CreateAdmin.create(adminRepository),
    impersonate: ImpersonatePartner.create(partnerRepository, authorization),
    logout: LogoutAdmin.create(adminRepository, authorization),
    refresh: RefreshAdmin.create(adminRepository, authorization),
  };
}
