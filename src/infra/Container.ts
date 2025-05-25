import { prisma } from "../package/prisma";
import { EventRepositoryPrisma } from "./repositories/event/EventRepositoryPrisma";
import { PartnerRepositoryPrisma } from "./repositories/partner/PartnerRepositoryPrisma";

import { CreatePartnerEvent } from "../usecase/event/CreatePartnerEvent";
import { DeletePartnerEvent } from "../usecase/event/DeletePartnerEvent";
import { ListPartnerEvent } from "../usecase/event/ListPartnerEvent";
import { UpdatePartnerEvent } from "../usecase/event/UpdatePartnerEvent";

import { CreatePartner } from "../usecase/partner/CreatePartner";
import { DeletePartner } from "../usecase/partner/DeletePartner";
import { ListPartner } from "../usecase/partner/ListPartner";
import { UpdatePartner } from "../usecase/partner/UpdatePartner";
import { LoginPartner } from "../usecase/partner/LoginPartner";
import { Authorization } from "./http/middlewares/Authorization";
import { RefreshPartner } from "../usecase/partner/RefreshPartner";
import { CreateEventSeller } from "../usecase/seller/CreateEventSeller";
import { ListEventSeller } from "../usecase/seller/ListEventSeller";
import { DeleteEventSeller } from "../usecase/seller/DeleteEventSeller";
import { UpdateEventSeller } from "../usecase/seller/UpdateEventSeller";
import { SellerRepositoryPrisma } from "./repositories/seller/SellerRepositoryPrisma";
import { CreatePartnerProduct } from "../usecase/product/CreatePartnerProduct";
import { ProductRepositoryPrisma } from "./repositories/product/ProductRepositoryPrisma";
import { DeletePartnerProduct } from "../usecase/product/DeletePartnerProduct";
import { ListPartnerProduct } from "../usecase/product/ListPartnerProduct";
import { UpdatePartnerProduct } from "../usecase/product/UpdatePartnerProduct";
import { FindPartnerEvent } from "../usecase/event/FindPartnerEvent";
import { FindPartnerProduct } from "../usecase/product/FindPartnerProduct";
import { FindEventSeller } from "../usecase/seller/FindEventSeller";
import { CreateSale } from "../usecase/sale/CreateSale";
import { ListSale } from "../usecase/sale/ListSale";
import { FindSale } from "../usecase/sale/FindSale";
import { DeleteSale } from "../usecase/sale/DeleteSale";
import { UpdateSale } from "../usecase/sale/UpdateSale";
import { SaleRepositoryPrisma } from "./repositories/sale/SaleRepositoryPrisma";
import { LogoutPartner } from "../usecase/partner/LogoutPartner";
import { FindPartner } from "../usecase/partner/FindPartner";
import { SwitchPartnerEventState } from "../usecase/event/SwitchPartnerEventState";
import { CreateSellerEvent } from "../usecase/sellerEvent/CreateSellerEvent";
import { SellerEventRepositoryPrisma } from "./repositories/sellerEvent/SellerEventRepositoryPrisma";
import { ListSellerByEvent } from "../usecase/sellerEvent/ListSellerByEvent";
import { ListEventsBySeller } from "../usecase/sellerEvent/ListEventsBySeller";
import { DeleteSellerEvent } from "../usecase/sellerEvent/DeleteSellerEvent";
import { FindEventSellerByEmail } from "../usecase/seller/FindEventSellerByEmail";
import { CreatePendingAction } from "../usecase/pendingAction/CreatePendingAction";
import { PendingActionRepositoryPrisma } from "./repositories/pendingAction/PendingActionRepositoryPrisma";
import { ListPendingAction } from "../usecase/pendingAction/ListPendingAction";
import { ApproveOrRejectPendingAction } from "../usecase/pendingAction/ApproveOrRejectPendingAction ";
import { SendGuestAccessInvite } from "../usecase/sellerEvent/SendGuestAccessInvite";
import { ResendAdapter } from "./mail/ResendAdapter";
import { Resend } from "resend";
import { GuestAccess } from "../usecase/sellerEvent/GuestAccess";
import { Client, LocalAuth } from "whatsapp-web.js";
import { WhatsappWebAdapter } from "./mail/WhatsappWebAdapter";

const partnerRepository = PartnerRepositoryPrisma.create(prisma);
const eventRepository = EventRepositoryPrisma.create(prisma);
const productRepository = ProductRepositoryPrisma.create(prisma);
const sellerRepository = SellerRepositoryPrisma.create(prisma);
const saleRepository = SaleRepositoryPrisma.create(prisma);
const sellerEventRepository = SellerEventRepositoryPrisma.create(prisma);
const pendingActionRepository = PendingActionRepositoryPrisma.create(prisma);

const secretKey = process.env.SECRET_KEY as string;
// const newResend = new Resend(process.env.RESEND_API_KEY as string);
// const mailer = new ResendAdapter(newResend);

// const whatsappClient = new Client({
//   authStrategy: new LocalAuth(), // autenticação persistente
//   puppeteer: {
//     headless: false, // ou false se quiser ver o navegador
//     args: ["--no-sandbox"],
//   },
// });

// whatsappClient.initialize();

// const whatsappService = WhatsappWebAdapter.create(whatsappClient);
export const authorization = Authorization.create(secretKey);
export const useCases = {
  partner: {
    login: LoginPartner.create(partnerRepository, authorization),
    logout: LogoutPartner.create(partnerRepository, authorization),
    refresh: RefreshPartner.create(partnerRepository, authorization),
    create: CreatePartner.create(partnerRepository),
    findOne: FindPartner.create(partnerRepository),
    list: ListPartner.create(partnerRepository),
    delete: DeletePartner.create(partnerRepository),
    update: UpdatePartner.create(partnerRepository),
  },
  event: {
    create: CreatePartnerEvent.create(eventRepository, partnerRepository),
    list: ListPartnerEvent.create(eventRepository, partnerRepository),
    findOne: FindPartnerEvent.create(eventRepository, partnerRepository),
    SwitchStatus: SwitchPartnerEventState.create(
      eventRepository,
      partnerRepository
    ),
    delete: DeletePartnerEvent.create(eventRepository, partnerRepository),
    update: UpdatePartnerEvent.create(eventRepository, partnerRepository),
  },
  product: {
    create: CreatePartnerProduct.create(productRepository, partnerRepository),
    list: ListPartnerProduct.create(productRepository, partnerRepository),
    findOne: FindPartnerProduct.create(productRepository, partnerRepository),
    delete: DeletePartnerProduct.create(productRepository, partnerRepository),
    update: UpdatePartnerProduct.create(productRepository, partnerRepository),
  },
  seller: {
    create: CreateEventSeller.create(sellerRepository, partnerRepository),
    list: ListEventSeller.create(sellerRepository, partnerRepository),
    findOne: FindEventSeller.create(sellerRepository, partnerRepository),
    findByEmail: FindEventSellerByEmail.create(
      sellerRepository,
      partnerRepository
    ),
    delete: DeleteEventSeller.create(sellerRepository, partnerRepository),
    update: UpdateEventSeller.create(sellerRepository, partnerRepository),
  },
  sellerEvent: {
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
  },

  sale: {
    create: CreateSale.create(
      saleRepository,
      eventRepository,
      productRepository,
      sellerRepository
    ),
    list: ListSale.create(
      saleRepository,
      eventRepository,
      productRepository,
      sellerRepository
    ),
    findOne: FindSale.create(
      saleRepository,
      eventRepository,
      productRepository,
      sellerRepository
    ),
    delete: DeleteSale.create(
      saleRepository,
      eventRepository,
      productRepository,
      sellerRepository
    ),
    update: UpdateSale.create(
      saleRepository,
      eventRepository,
      productRepository,
      sellerRepository
    ),
  },
  pendingAction: {
    create: CreatePendingAction.create(pendingActionRepository),
    list: ListPendingAction.create(pendingActionRepository),
    approveOrReject: ApproveOrRejectPendingAction.create(
      pendingActionRepository,
      saleRepository
    ),
  },
};
