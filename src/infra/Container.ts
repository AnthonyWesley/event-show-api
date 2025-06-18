import { prisma } from "../package/prisma";
import { AdminRepositoryPrisma } from "./repositories/adm/AdminRepositoryPrisma";
import { PartnerRepositoryPrisma } from "./repositories/partner/PartnerRepositoryPrisma";
import { EventRepositoryPrisma } from "./repositories/event/EventRepositoryPrisma";
import { ProductRepositoryPrisma } from "./repositories/product/ProductRepositoryPrisma";
import { SellerRepositoryPrisma } from "./repositories/seller/SellerRepositoryPrisma";
import { SaleRepositoryPrisma } from "./repositories/sale/SaleRepositoryPrisma";
import { SellerEventRepositoryPrisma } from "./repositories/sellerEvent/SellerEventRepositoryPrisma";
import { PendingActionRepositoryPrisma } from "./repositories/pendingAction/PendingActionRepositoryPrisma";
import { Authorization } from "./http/middlewares/Authorization";
import { makeAdminUseCases } from "./container/admin";
import { makePartnerUseCases } from "./container/partner";
import { makeEventUseCases } from "./container/event";
import { makeProductUseCases } from "./container/product";
import { makeSellerUseCases } from "./container/seller";
import { makeSellerEventUseCases } from "./container/sellerEvent";
import { makeSaleUseCases } from "./container/sale";
import { makePendingActionUseCases } from "./container/pendingAction";
import { LeadRepositoryPrisma } from "./repositories/lead/LeadRepositoryPrisma";
import { makeLeadUseCases } from "./container/lead";
import { CsvLeadExporter } from "./exporters/CsvLeadExporter";

export const adminRepository = AdminRepositoryPrisma.create(prisma);
export const partnerRepository = PartnerRepositoryPrisma.create(prisma);
export const eventRepository = EventRepositoryPrisma.create(prisma);
export const leadRepository = LeadRepositoryPrisma.create(prisma);
export const productRepository = ProductRepositoryPrisma.create(prisma);
export const sellerRepository = SellerRepositoryPrisma.create(prisma);
export const saleRepository = SaleRepositoryPrisma.create(prisma);
export const sellerEventRepository = SellerEventRepositoryPrisma.create(prisma);
export const pendingActionRepository =
  PendingActionRepositoryPrisma.create(prisma);

const secretKey = process.env.SECRET_KEY as string;
export const authorization = Authorization.create(secretKey);
const exporter = new CsvLeadExporter();

export const admin = makeAdminUseCases(
  adminRepository,
  authorization,
  partnerRepository
);
export const partner = makePartnerUseCases(partnerRepository, authorization);
export const event = makeEventUseCases(eventRepository);
export const product = makeProductUseCases(productRepository);
export const lead = makeLeadUseCases(
  leadRepository,
  eventRepository,
  partnerRepository,
  exporter
);
export const seller = makeSellerUseCases(sellerRepository, authorization);
export const sellerEvent = makeSellerEventUseCases(sellerEventRepository);
export const sale = makeSaleUseCases(saleRepository);
export const pendingAction = makePendingActionUseCases(pendingActionRepository);

export const useCases = {
  admin,
  partner,
  event,
  lead,
  product,
  seller,
  sellerEvent,
  sale,
  pendingAction,
};
