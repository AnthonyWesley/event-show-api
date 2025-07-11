import { ActivateCompany } from "../../usecase/company/ActivateCompany";
import { CreateCompany } from "../../usecase/company/CreateCompany";
import { DeleteCompany } from "../../usecase/company/DeleteCompany";
import { FindCompany } from "../../usecase/company/FindCompany";
import { ListCompany } from "../../usecase/company/ListCompany";
import { SuspendCompany } from "../../usecase/company/SuspendCompany";
import { UpdateCompany } from "../../usecase/company/UpdateCompany";
import { UpdateCompanyPhoto } from "../../usecase/company/UpdateCompanyPhoto";
import { Authorization } from "../http/middlewares/Authorization";
import { CompanyRepositoryPrisma } from "../repositories/company/CompanyRepositoryPrisma";
import { UserRepositoryPrisma } from "../repositories/user/UserRepositoryPrisma";
import { CloudinaryUploadService } from "../services/CloudinaryUploadService";

export function makeCompanyUseCases(
  companyRepository: CompanyRepositoryPrisma,
  userRepository: UserRepositoryPrisma,
  uploadPhotoService: CloudinaryUploadService,
  authorization: Authorization
) {
  return {
    active: ActivateCompany.create(companyRepository),
    suspend: SuspendCompany.create(companyRepository),
    create: CreateCompany.create(
      companyRepository,
      userRepository,
      authorization
    ),
    findOne: FindCompany.create(companyRepository),
    list: ListCompany.create(companyRepository),
    delete: DeleteCompany.create(companyRepository),
    update: UpdateCompany.create(companyRepository),
    updatePhoto: UpdateCompanyPhoto.create(
      companyRepository,
      uploadPhotoService
    ),
  };
}
