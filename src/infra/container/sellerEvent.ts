import { CreateSellerEvent } from "../../usecase/sellerEvent/CreateSellerEvent";
import { DeleteSellerEvent } from "../../usecase/sellerEvent/DeleteSellerEvent";
import { GuestAccess } from "../../usecase/sellerEvent/GuestAccess";
import { ListEventsBySeller } from "../../usecase/sellerEvent/ListEventsBySeller";
import { ListSellerByEvent } from "../../usecase/sellerEvent/ListSellerByEvent";

import { Authorization } from "../http/middlewares/Authorization";
import { CompanyRepositoryPrisma } from "../repositories/company/CompanyRepositoryPrisma";
import { EventRepositoryPrisma } from "../repositories/event/EventRepositoryPrisma";
import { SellerRepositoryPrisma } from "../repositories/seller/SellerRepositoryPrisma";
import { SellerEventRepositoryPrisma } from "../repositories/sellerEvent/SellerEventRepositoryPrisma";

export function makeSellerEventUseCases(
  sellerEventRepository: SellerEventRepositoryPrisma,
  companyRepository: CompanyRepositoryPrisma,
  eventRepository: EventRepositoryPrisma,
  sellerRepository: SellerRepositoryPrisma,
  authorization: Authorization
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
      companyRepository,
      eventRepository,
      sellerRepository,
      authorization
    ),
    listSeller: ListSellerByEvent.create(
      sellerEventRepository,
      companyRepository,
      eventRepository
    ),
    listEvent: ListEventsBySeller.create(
      sellerEventRepository,
      companyRepository,
      eventRepository
    ),
    delete: DeleteSellerEvent.create(sellerEventRepository),
    // update: UpdateSeller.create(sellerRepository, companyRepository),
  };
}
