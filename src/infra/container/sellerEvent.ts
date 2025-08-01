import { IInviteGateway } from "../../domain/entities/invite/IInviteGateway";
import { AuthTokenService } from "../../service/AuthTokenService";
import { CreateSellerEvent } from "../../usecase/sellerEvent/CreateSellerEvent";
import { DeleteSellerEvent } from "../../usecase/sellerEvent/DeleteSellerEvent";
import { GuestAccess } from "../../usecase/sellerEvent/GuestAccess";
import { ListEventsBySeller } from "../../usecase/sellerEvent/ListEventsBySeller";
import { ListSellerByEvent } from "../../usecase/sellerEvent/ListSellerByEvent";
import { SendGuestAccessInvite } from "../../usecase/sellerEvent/SendGuestAccessInvite";
import { IWhatsAppService } from "../mail/IWhatsAppService";
import { CompanyRepositoryPrisma } from "../repositories/company/CompanyRepositoryPrisma";
import { EventRepositoryPrisma } from "../repositories/event/EventRepositoryPrisma";
import { SellerRepositoryPrisma } from "../repositories/seller/SellerRepositoryPrisma";
import { SellerEventRepositoryPrisma } from "../repositories/sellerEvent/SellerEventRepositoryPrisma";
import { SocketServer } from "../socket/SocketServer";

export function makeSellerEventUseCases(
  sellerEventRepository: SellerEventRepositoryPrisma,
  companyRepository: CompanyRepositoryPrisma,
  eventRepository: EventRepositoryPrisma,
  sellerRepository: SellerRepositoryPrisma,
  inviteGateway: IInviteGateway,
  tokenService: AuthTokenService,
  socketServer: SocketServer,
  sendMessageService: IWhatsAppService
) {
  return {
    create: CreateSellerEvent.create(sellerEventRepository, socketServer),
    sendMessage: SendGuestAccessInvite.create(
      companyRepository,
      eventRepository,
      sellerRepository,
      inviteGateway,
      sendMessageService,
      tokenService
    ),
    guestAccess: GuestAccess.create(
      companyRepository,
      eventRepository,
      sellerRepository,
      inviteGateway,
      tokenService
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
    delete: DeleteSellerEvent.create(sellerEventRepository, socketServer),
    // update: UpdateSeller.create(sellerRepository, companyRepository),
  };
}
