import { CreateAdmin } from "../../usecase/adm/CreateAdmin";
import { ImpersonatePartner } from "../../usecase/adm/ImpersonatePartner";
import { LoginAdmin } from "../../usecase/adm/LoginAdm";
import { Authorization } from "../http/middlewares/Authorization";
import { AdminRepositoryPrisma } from "../repositories/adm/AdminRepositoryPrisma";
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
  };
}
