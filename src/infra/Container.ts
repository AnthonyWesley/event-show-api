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
import { prisma } from "../package/prisma";
import { makeLeadSourceUseCases } from "./container/leadSource";
import { LeadSourceRepositoryPrisma } from "./repositories/leadSource/LeadSourceRepositoryPrisma";
import { AuthTokenService } from "../service/AuthTokenService";
import { ServiceTokenService } from "../service/ServiceTokenService";
import { WhatsAppService } from "./mail/WhatsAppService";
import { InviteRepositoryPrisma } from "./repositories/invite/InviteRepositoryPrisma";
import { SetupDefaultLeadFields } from "../usecase/LeadCustomField/SetupDefaultLeadFields";
import { LeadCustomFieldRepositoryPrisma } from "./repositories/leadCustomField/LeadRepositoryPrisma";
import { LeadCustomValueRepositoryPrisma } from "./repositories/leadCustomValue/LeadCustomValueRepositoryPrisma";
import { UpsertLeadCustomValues } from "../usecase/LeadCustomValues/UpsertLeadCustomValues";
import { UpdateSellersGoalService } from "../usecase/event/UpdateSellersGoalService";

export function makeUseCases(
  socketServer: SocketServer,
  authorization: AuthTokenService,
  serviceToken: ServiceTokenService
) {
  const uploader = new CloudinaryUploadService();
  const exporter = new CsvLeadExporter();
  const sendMessageService = new WhatsAppService();
  // const minIoUploadService = new MinIoUploadService();

  const adminRepository = AdminRepositoryPrisma.create(prisma);
  const userRepository = UserRepositoryPrisma.create(prisma);
  const companyRepository = CompanyRepositoryPrisma.create(prisma);
  const eventRepository = EventRepositoryPrisma.create(prisma);
  const leadRepository = LeadRepositoryPrisma.create(prisma);
  const leadSourceRepository = LeadSourceRepositoryPrisma.create(prisma);
  const productRepository = ProductRepositoryPrisma.create(prisma);
  const sellerRepository = SellerRepositoryPrisma.create(prisma);
  const saleRepository = SaleRepositoryPrisma.create(prisma);
  const sellerEventRepository = SellerEventRepositoryPrisma.create(prisma);
  const pendingActionRepository = PendingActionRepositoryPrisma.create(prisma);
  const invoiceRepository = InvoiceRepositoryPrisma.create(prisma);
  const subscriptionRepository = SubscriptionRepositoryPrisma.create(prisma);
  const inviteRepository = InviteRepositoryPrisma.create(prisma);
  const leadCustomFieldsRepository =
    LeadCustomFieldRepositoryPrisma.create(prisma);

  const leadCustomValuesRepository =
    LeadCustomValueRepositoryPrisma.create(prisma);

  const setupDefaultLeadFields = new SetupDefaultLeadFields(
    leadCustomFieldsRepository
  );
  const updateSellersGoalService = new UpdateSellersGoalService(
    sellerEventRepository
  );

  const upsertLeadCustomValues = UpsertLeadCustomValues.create(
    leadCustomValuesRepository
  );
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
      authorization,
      setupDefaultLeadFields
    ),
    event: makeEventUseCases(
      eventRepository,
      companyRepository,
      uploader,
      updateSellersGoalService,
      socketServer
    ),
    product: makeProductUseCases(
      productRepository,
      companyRepository,
      uploader
    ),
    lead: makeLeadUseCases(
      leadRepository,
      eventRepository,
      companyRepository,
      leadSourceRepository,
      exporter,
      upsertLeadCustomValues
    ),
    leadSource: makeLeadSourceUseCases(leadSourceRepository, companyRepository),
    seller: makeSellerUseCases(
      sellerRepository,
      companyRepository,
      uploader,
      // minIoUploadService,
      socketServer
    ),
    sellerEvent: makeSellerEventUseCases(
      sellerEventRepository,
      companyRepository,
      eventRepository,
      sellerRepository,
      inviteRepository,
      authorization,
      socketServer,
      sendMessageService,
      updateSellersGoalService
    ),
    sale: makeSaleUseCases(
      saleRepository,
      eventRepository,
      productRepository,
      sellerRepository,
      socketServer
    ),
    pendingAction: makePendingActionUseCases(
      pendingActionRepository,
      saleRepository,
      socketServer
    ),
    invoice: makeInvoiceUseCases(invoiceRepository),
    subscription: makeSubscriptionUseCases(
      subscriptionRepository,
      companyRepository,
      serviceToken
    ),
  };
}
