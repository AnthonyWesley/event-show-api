import { CreateEventSeller } from "../../usecase/seller/CreateEventSeller";
import { DeleteEventSeller } from "../../usecase/seller/DeleteEventSeller";
import { FindEventSeller } from "../../usecase/seller/FindEventSeller";
import { FindEventSellerByEmail } from "../../usecase/seller/FindEventSellerByEmail";
import { ListEventSeller } from "../../usecase/seller/ListEventSeller";
import { UpdateEventSeller } from "../../usecase/seller/UpdateEventSeller";
import { UpdateSellerPhoto } from "../../usecase/seller/UpdateSellerPhoto";
import { partnerRepository } from "../Container";
import { SellerRepositoryPrisma } from "../repositories/seller/SellerRepositoryPrisma";
import { CloudinaryUploadService } from "../services/CloudinaryUploadService";

export function makeSellerUseCases(
  sellerRepository: SellerRepositoryPrisma,
  uploadPhotoService: CloudinaryUploadService
) {
  return {
    create: CreateEventSeller.create(sellerRepository, partnerRepository),
    list: ListEventSeller.create(sellerRepository, partnerRepository),
    findOne: FindEventSeller.create(sellerRepository, partnerRepository),
    findByEmail: FindEventSellerByEmail.create(
      sellerRepository,
      partnerRepository
    ),
    delete: DeleteEventSeller.create(sellerRepository, partnerRepository),
    update: UpdateEventSeller.create(sellerRepository, partnerRepository),
    updatePhoto: UpdateSellerPhoto.create(
      sellerRepository,
      partnerRepository,
      uploadPhotoService
    ),
  };
}
