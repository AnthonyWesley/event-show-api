import { AuthTokenService } from "../../service/AuthTokenService";
import { ActivateCompany } from "../../usecase/company/ActivateCompany";
import { CreateCompany } from "../../usecase/company/CreateCompany";
import { DeleteCompany } from "../../usecase/company/DeleteCompany";
import { FindCompany } from "../../usecase/company/FindCompany";
import { ListCompany } from "../../usecase/company/ListCompany";

import { SuspendCompany } from "../../usecase/company/SuspendCompany";
import { UpdateCompany } from "../../usecase/company/UpdateCompany";
import { UpdateCompanyPhoto } from "../../usecase/company/UpdateCompanyPhoto";
import { CreateUser } from "../../usecase/user/CreateUser";
import { DeleteUser } from "../../usecase/user/DeleteUser";
import { FindUser } from "../../usecase/user/FindUser";
import { ListUsers } from "../../usecase/user/ListUsers";
import { LoginUser } from "../../usecase/user/LoginUser";
import { LogoutUser } from "../../usecase/user/LogoutUser";
import { RefreshUser } from "../../usecase/user/RefreshUser";
import { UpdateUser } from "../../usecase/user/UpdateUser";
import { UpdateUserPhoto } from "../../usecase/user/UpdateUserPhoto";
import { AuthorizationRoute } from "../http/middlewares/AuthorizationRoute";
import { UserRepositoryPrisma } from "../repositories/user/UserRepositoryPrisma";
import { CloudinaryUploadService } from "../services/CloudinaryUploadService";

export function makeUserUseCases(
  userRepository: UserRepositoryPrisma,
  uploadPhotoService: CloudinaryUploadService,
  authorization: AuthTokenService
) {
  return {
    login: LoginUser.create(userRepository, authorization),
    logout: LogoutUser.create(userRepository, authorization),
    refresh: RefreshUser.create(userRepository, authorization),
    create: CreateUser.create(userRepository),
    findOne: FindUser.create(userRepository),
    list: ListUsers.create(userRepository),
    delete: DeleteUser.create(userRepository),
    update: UpdateUser.create(userRepository, authorization),
    updatePhoto: UpdateUserPhoto.create(userRepository, uploadPhotoService),
  };
}
