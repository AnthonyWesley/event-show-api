import { CreateEventSeller } from "../../usecase/seller/CreateEventSeller";
import { DeleteEventSeller } from "../../usecase/seller/DeleteEventSeller";
import { FindEventSeller } from "../../usecase/seller/FindEventSeller";
import { FindEventSellerByEmail } from "../../usecase/seller/FindEventSellerByEmail";
import { ListEventSeller } from "../../usecase/seller/ListEventSeller";
import { UpdateEventSeller } from "../../usecase/seller/UpdateEventSeller";
import { partnerRepository } from "../Container";
import { Authorization } from "../http/middlewares/Authorization";
import { SellerRepositoryPrisma } from "../repositories/seller/SellerRepositoryPrisma";

export function makeSellerUseCases(
  sellerRepository: SellerRepositoryPrisma,
  authorization: Authorization
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
  };
}
