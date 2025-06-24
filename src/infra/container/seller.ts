import { CreateSeller } from "../../usecase/seller/CreateSeller";
import { DeleteSeller } from "../../usecase/seller/DeleteSeller";
import { FindSeller } from "../../usecase/seller/FindSeller";
import { FindSellerByEmail } from "../../usecase/seller/FindSellerByEmail";
import { ListSeller } from "../../usecase/seller/ListSeller";
import { UpdateSeller } from "../../usecase/seller/UpdateSeller";
import { UpdateSellerPhoto } from "../../usecase/seller/UpdateSellerPhoto";
import { partnerRepository } from "../Container";
import { SellerRepositoryPrisma } from "../repositories/seller/SellerRepositoryPrisma";
import { CloudinaryUploadService } from "../services/CloudinaryUploadService";

export function makeSellerUseCases(
  sellerRepository: SellerRepositoryPrisma,
  uploadPhotoService: CloudinaryUploadService
) {
  return {
    create: CreateSeller.create(sellerRepository, partnerRepository),
    list: ListSeller.create(sellerRepository, partnerRepository),
    findOne: FindSeller.create(sellerRepository, partnerRepository),
    findByEmail: FindSellerByEmail.create(sellerRepository, partnerRepository),
    delete: DeleteSeller.create(sellerRepository, partnerRepository),
    update: UpdateSeller.create(sellerRepository, partnerRepository),
    updatePhoto: UpdateSellerPhoto.create(
      sellerRepository,
      partnerRepository,
      uploadPhotoService
    ),
  };
}
