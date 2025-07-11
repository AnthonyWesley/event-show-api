import { CreateSeller } from "../../usecase/seller/CreateSeller";
import { DeleteSeller } from "../../usecase/seller/DeleteSeller";
import { FindSeller } from "../../usecase/seller/FindSeller";
import { FindSellerByEmail } from "../../usecase/seller/FindSellerByEmail";
import { ListSeller } from "../../usecase/seller/ListSeller";
import { UpdateSeller } from "../../usecase/seller/UpdateSeller";
import { UpdateSellerPhoto } from "../../usecase/seller/UpdateSellerPhoto";
import { CompanyRepositoryPrisma } from "../repositories/company/CompanyRepositoryPrisma";
import { SellerRepositoryPrisma } from "../repositories/seller/SellerRepositoryPrisma";
import { CloudinaryUploadService } from "../services/CloudinaryUploadService";

export function makeSellerUseCases(
  sellerRepository: SellerRepositoryPrisma,
  companyRepository: CompanyRepositoryPrisma,
  uploadPhotoService: CloudinaryUploadService
) {
  return {
    create: CreateSeller.create(sellerRepository, companyRepository),
    list: ListSeller.create(sellerRepository, companyRepository),
    findOne: FindSeller.create(sellerRepository, companyRepository),
    findByEmail: FindSellerByEmail.create(sellerRepository, companyRepository),
    delete: DeleteSeller.create(sellerRepository, companyRepository),
    update: UpdateSeller.create(sellerRepository, companyRepository),
    updatePhoto: UpdateSellerPhoto.create(
      sellerRepository,
      companyRepository,
      uploadPhotoService
    ),
  };
}
