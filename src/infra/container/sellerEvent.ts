import { CreateSellerEvent } from "../../usecase/sellerEvent/CreateSellerEvent";
import { DeleteSellerEvent } from "../../usecase/sellerEvent/DeleteSellerEvent";
import { GuestAccess } from "../../usecase/sellerEvent/GuestAccess";
import { ListEventsBySeller } from "../../usecase/sellerEvent/ListEventsBySeller";
import { ListSellerByEvent } from "../../usecase/sellerEvent/ListSellerByEvent";
import {
  partnerRepository,
  eventRepository,
  sellerRepository,
  authorization,
} from "../Container";
import { SellerEventRepositoryPrisma } from "../repositories/sellerEvent/SellerEventRepositoryPrisma";

export function makeSellerEventUseCases(
  sellerEventRepository: SellerEventRepositoryPrisma
) {
  return {
    create: CreateSellerEvent.create(sellerEventRepository),
    // register: SendGuestAccessInvite.create(
    //   sellerRepository,
    //   authorization,
    //   mailer,
    //   whatsappService
    // ),
    guestAccess: GuestAccess.create(
      partnerRepository,
      eventRepository,
      sellerRepository,
      authorization
    ),
    listSeller: ListSellerByEvent.create(
      sellerEventRepository,
      partnerRepository,
      eventRepository
    ),
    listEvent: ListEventsBySeller.create(
      sellerEventRepository,
      partnerRepository,
      eventRepository
    ),
    delete: DeleteSellerEvent.create(sellerEventRepository),
    // update: UpdateEventSeller.create(sellerRepository, partnerRepository),
  };
}
