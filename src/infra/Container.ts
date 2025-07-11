import { CsvLeadExporter } from "./exporters/CsvLeadExporter";
import { CloudinaryUploadService } from "./services/CloudinaryUploadService";

import { AdminRepositoryPrisma } from "./repositories/admin/AdminRepositoryPrisma";
import { UserRepositoryPrisma } from "./repositories/user/UserRepositoryPrisma";
import { CompanyRepositoryPrisma } from "./repositories/company/CompanyRepositoryPrisma";
import { EventRepositoryPrisma } from "./repositories/event/EventRepositoryPrisma";
import { LeadRepositoryPrisma } from "./repositories/lead/LeadRepositoryPrisma";
import { ProductRepositoryPrisma } from "./repositories/product/ProductRepositoryPrisma";
import { SellerRepositoryPrisma } from "./repositories/seller/SellerRepositoryPrisma";
import { SaleRepositoryPrisma } from "./repositories/sale/SaleRepositoryPrisma";
import { SellerEventRepositoryPrisma } from "./repositories/sellerEvent/SellerEventRepositoryPrisma";
import { PendingActionRepositoryPrisma } from "./repositories/pendingAction/PendingActionRepositoryPrisma";
import { InvoiceRepositoryPrisma } from "./repositories/invoice/InvoiceRepositoryPrisma";
import { SubscriptionRepositoryPrisma } from "./repositories/subscription/SubscriptionRepositoryPrisma";

import { makeAdminUseCases } from "./container/admin";
import { makeUserUseCases } from "./container/user";
import { makeCompanyUseCases } from "./container/company";
import { makeEventUseCases } from "./container/event";
import { makeLeadUseCases } from "./container/lead";
import { makeProductUseCases } from "./container/product";
import { makeSellerUseCases } from "./container/seller";
import { makeSaleUseCases } from "./container/sale";
import { makeSellerEventUseCases } from "./container/sellerEvent";
import { makePendingActionUseCases } from "./container/pendingAction";
import { makeInvoiceUseCases } from "./container/invoice";
import { makeSubscriptionUseCases } from "./container/subscription";

import { SocketServer } from "./socket/SocketServer";
import { Authorization } from "./http/middlewares/Authorization";
import { prisma } from "../package/prisma";

export function makeUseCases(
  socketServer: SocketServer,
  authorization: Authorization
) {
  const uploader = new CloudinaryUploadService();
  const exporter = new CsvLeadExporter();

  const adminRepository = AdminRepositoryPrisma.create(prisma);
  const userRepository = UserRepositoryPrisma.create(prisma);
  const companyRepository = CompanyRepositoryPrisma.create(prisma);
  const eventRepository = EventRepositoryPrisma.create(prisma);
  const leadRepository = LeadRepositoryPrisma.create(prisma);
  const productRepository = ProductRepositoryPrisma.create(prisma);
  const sellerRepository = SellerRepositoryPrisma.create(prisma);
  const saleRepository = SaleRepositoryPrisma.create(prisma);
  const sellerEventRepository = SellerEventRepositoryPrisma.create(prisma);
  const pendingActionRepository = PendingActionRepositoryPrisma.create(prisma);
  const invoiceRepository = InvoiceRepositoryPrisma.create(prisma);
  const subscriptionRepository = SubscriptionRepositoryPrisma.create(prisma);

  return {
    admin: makeAdminUseCases(
      adminRepository,
      userRepository,
      authorization,
      companyRepository
    ),
    user: makeUserUseCases(userRepository, uploader, authorization),
    company: makeCompanyUseCases(
      companyRepository,
      userRepository,
      uploader,
      authorization
    ),
    event: makeEventUseCases(eventRepository, companyRepository, uploader),
    product: makeProductUseCases(
      productRepository,
      companyRepository,
      uploader
    ),
    lead: makeLeadUseCases(
      leadRepository,
      eventRepository,
      companyRepository,
      exporter
    ),
    seller: makeSellerUseCases(sellerRepository, companyRepository, uploader),
    sellerEvent: makeSellerEventUseCases(
      sellerEventRepository,
      companyRepository,
      eventRepository,
      sellerRepository,
      authorization
    ),
    sale: makeSaleUseCases(
      saleRepository,
      eventRepository,
      productRepository,
      sellerRepository
    ),
    pendingAction: makePendingActionUseCases(
      pendingActionRepository,
      saleRepository,
      socketServer
    ),
    invoice: makeInvoiceUseCases(invoiceRepository),
    subscription: makeSubscriptionUseCases(subscriptionRepository),
  };
}
