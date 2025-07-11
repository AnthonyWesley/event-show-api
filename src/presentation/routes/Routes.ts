// src/presentation/routes/Routes.ts
// ajuste o caminho conforme seu projeto
import { upload } from "../../infra/http/middlewares/multer";

import { CreateAdminRoute } from "./admin/CreateAdminRoute";
import { LoginAdminRoute } from "./admin/LoginAdminRoute";
import { LogoutAdminRoute } from "./admin/LogoutAdminRoute";
import { RefreshAdminRoute } from "./admin/RefreshAdminRoute";
import { UpdateEventPhotoRoute } from "./event/UpdateEventPhotoRoute";
import { CreateLeadRoute } from "./lead/CreateLeadRoute";
import { DeleteLeadRoute } from "./lead/DeleteLeadRoute";
import { ExportLeadRoute } from "./lead/ExportLeadRoute";
import { FindLeadRoute } from "./lead/FindLeadRoute";
import { ListLeadByEventRoute } from "./lead/ListLeadByEventRoute";
import { UpdateLeadRoute } from "./lead/UpdateLeadRoute";
import { ApproveOrRejectPendingActionRoute } from "./pendingAction/ApproveOrRejectPendingActionRoute";
import { CreatePendingActionRoute } from "./pendingAction/CreatePendingActionRoute";
import { ListPendingActionRoute } from "./pendingAction/ListPendingActionRoute";
import { UpdateProductPhotoRoute } from "./product/UpdateProductPhotoRoute";
import { CreateSaleRoute } from "./sale/CreateSaleRoute";
import { DeleteSaleRoute } from "./sale/DeleteSaleRoute";
import { FindSaleRoute } from "./sale/FindSaleRoute";
import { ListSaleRoute } from "./sale/ListSaleRoute";
import { UpdateSaleRoute } from "./sale/UpdateSaleRoute";

import { UpdateSellerPhotoRoute } from "./seller/UpdateSellerPhotoRoute";
import { CreateSellerEventRoute } from "./sellerEvent/CreateSellerEventRoute";
import { DeleteSellerEventRoute } from "./sellerEvent/DeleteSellerEventRoute";
import { GuestAccessRoute } from "./sellerEvent/GuestAccessRoute";
import { ListEventsBySellerRoute } from "./sellerEvent/ListEventsBySellerRoute";
import { ListSellerByEventRoute } from "./sellerEvent/ListSellerByEventRoute";
import { CreateEventRoute } from "./event/CreateEventRoute";
import { DeleteEventRoute } from "./event/DeleteEventRoute";
import { SwitchEventStateRoute } from "./event/SwitchEventStateRoute";
import { UpdateEventRoute } from "./event/UpdateEventRoute";
import { CreateProductRoute } from "./product/CreateProductRoute";
import { DeleteProductRoute } from "./product/DeleteProductRoute";
import { FindProductRoute } from "./product/FindProductRoute";
import { ListProductRoute } from "./product/ListProductRoute";
import { UpdateProductRoute } from "./product/UpdateProductRoute";
import { CreateSellerRoute } from "./seller/CreateSellerRoute";
import { DeleteSellerRoute } from "./seller/DeleteSellerRoute";
import { FindSellerByEmailRoute } from "./seller/FindSellerByEmailRoute";
import { FindSellerRoute } from "./seller/FindSellerRoute";
import { ListSellerRoute } from "./seller/ListSellerRoute";
import { UpdateSellerRoute } from "./seller/UpdateSellerRoute";
import { FindEventRoute } from "./event/FindEventRoute";
import { ListEventRoute } from "./event/ListEventRoute";
import { ImpersonateCompanyRoute } from "./admin/ImpersonateCompanyRoute";
import { ActivateCompanyRoute } from "./company/ActivateCompanyRoute";
import { CreateCompanyRoute } from "./company/CreateCompanyRoute";
import { DeleteCompanyRoute } from "./company/DeleteCompanyRoute";
import { FindCompanyRoute } from "./company/FindCompanyRoute";
import { ListCompanyRoute } from "./company/ListCompanyRoute";

import { SuspendCompanyRoute } from "./company/SuspendCompanyRoute";
import { UpdateCompanyPhotoRoute } from "./company/UpdateCompanyPhotoRoute";
import { UpdateCompanyRoute } from "./company/UpdateCompanyRoute";
import { ListLeadByCompanies } from "./lead/ListLeadByCompany";
import { CreateUserRoute } from "./user/CreateUserRoute";
import { DeleteUserRoute } from "./user/DeleteUserRoute";
import { FindUserRoute } from "./user/FindUserRoute";
import { ListUserRoute } from "./user/ListUserRoute";
import { LoginUserRoute } from "./user/LoginUserRoute";
import { LogoutUserRoute } from "./user/LogoutUserRoute";
import { RefreshUserRoute } from "./user/RefreshUserRoute";
import { UpdateUserPhotoRoute } from "./user/UpdateUserPhotoRoute";
import { UpdateUserRoute } from "./user/UpdateUserRoute";
import { CreateSubscriptionRoute } from "./subscription/CreateSubscriptionRoute";
import { CancelSubscriptionRoute } from "./subscription/CancelSubscriptionRoute";
import { GetSubscriptionByCompanyRoute } from "./subscription/GetSubscriptionByCompanyRoute";
import { CreateInvoiceRoute } from "./invoice/CreateInvoiceRoute";
import { GetInvoiceByIdRoute } from "./invoice/GetInvoiceByIdRoute";
import { GetInvoicesByCompanyRoute } from "./invoice/GetInvoicesByCompanyRoute";
import { MarkInvoiceAsPaidRoute } from "./invoice/MarkInvoiceAsPaidRoute";
import { Authorization } from "../../infra/http/middlewares/Authorization";

export function makeRoutes(useCases: any, authorization: Authorization) {
  return [
    LoginAdminRoute.create(useCases.admin.login),
    CreateAdminRoute.create(useCases.admin.create),
    ImpersonateCompanyRoute.create(useCases.admin.impersonate, authorization),
    LogoutAdminRoute.create(useCases.admin.logout),
    RefreshAdminRoute.create(useCases.admin.refresh),

    LoginUserRoute.create(useCases.user.login),
    RefreshUserRoute.create(useCases.user.refresh),
    LogoutUserRoute.create(useCases.user.logout),
    FindUserRoute.create(useCases.user.findOne, authorization),
    CreateUserRoute.create(useCases.user.create, authorization),
    ListUserRoute.create(useCases.user.list, authorization),
    DeleteUserRoute.create(useCases.user.delete, authorization),
    UpdateUserRoute.create(useCases.user.update, authorization),
    UpdateUserPhotoRoute.create(
      useCases.user.updatePhoto,
      authorization,
      upload
    ),

    ActivateCompanyRoute.create(useCases.company.active, authorization),
    SuspendCompanyRoute.create(useCases.company.suspend, authorization),
    FindCompanyRoute.create(useCases.company.findOne, authorization),
    CreateCompanyRoute.create(useCases.company.create, authorization),
    ListCompanyRoute.create(useCases.company.list, authorization),
    DeleteCompanyRoute.create(useCases.company.delete, authorization),
    UpdateCompanyRoute.create(useCases.company.update, authorization),
    UpdateCompanyPhotoRoute.create(
      useCases.company.updatePhoto,
      authorization,
      upload
    ),

    CreateEventRoute.create(useCases.event.create, authorization),
    ListEventRoute.create(useCases.event.list, authorization),
    FindEventRoute.create(useCases.event.findOne, authorization),
    SwitchEventStateRoute.create(useCases.event.SwitchStatus, authorization),
    DeleteEventRoute.create(useCases.event.delete, authorization),
    UpdateEventRoute.create(useCases.event.update, authorization),
    UpdateEventPhotoRoute.create(
      useCases.event.updatePhoto,
      authorization,
      upload
    ),

    CreateProductRoute.create(useCases.product.create, authorization),
    ListProductRoute.create(useCases.product.list, authorization),
    FindProductRoute.create(useCases.product.findOne, authorization),
    DeleteProductRoute.create(useCases.product.delete, authorization),
    UpdateProductRoute.create(useCases.product.update, authorization),
    UpdateProductPhotoRoute.create(
      useCases.product.updatePhoto,
      authorization,
      upload
    ),

    CreateLeadRoute.create(useCases.lead.create, authorization),
    ListLeadByEventRoute.create(useCases.lead.listByEvent, authorization),
    ExportLeadRoute.create(useCases.lead.exportLead, authorization),
    ListLeadByCompanies.create(useCases.lead.listByCompany, authorization),
    FindLeadRoute.create(useCases.lead.findOne, authorization),
    DeleteLeadRoute.create(useCases.lead.delete, authorization),
    UpdateLeadRoute.create(useCases.lead.update, authorization),

    CreateSellerRoute.create(useCases.seller.create, authorization),
    ListSellerRoute.create(useCases.seller.list, authorization),
    FindSellerRoute.create(useCases.seller.findOne, authorization),
    FindSellerByEmailRoute.create(useCases.seller.findByEmail, authorization),
    DeleteSellerRoute.create(useCases.seller.delete, authorization),
    UpdateSellerRoute.create(useCases.seller.update, authorization),
    UpdateSellerPhotoRoute.create(
      useCases.seller.updatePhoto,
      authorization,
      upload
    ),

    CreateSaleRoute.create(useCases.sale.create, authorization),
    ListSaleRoute.create(useCases.sale.list, authorization),
    FindSaleRoute.create(useCases.sale.findOne, authorization),
    DeleteSaleRoute.create(useCases.sale.delete, authorization),
    UpdateSaleRoute.create(useCases.sale.update, authorization),

    CreateSellerEventRoute.create(useCases.sellerEvent.create, authorization),
    // SendGuestAccessInviteRoute.create(
    //   useCases.sellerEvent.register,
    //   authorization
    // ),
    GuestAccessRoute.create(useCases.sellerEvent.guestAccess, authorization),
    ListEventsBySellerRoute.create(
      useCases.sellerEvent.listEvent,
      authorization
    ),
    ListSellerByEventRoute.create(
      useCases.sellerEvent.listSeller,
      authorization
    ),
    DeleteSellerEventRoute.create(useCases.sellerEvent.delete, authorization),

    CreatePendingActionRoute.create(
      useCases.pendingAction.create,
      authorization
    ),
    ListPendingActionRoute.create(useCases.pendingAction.list, authorization),
    ApproveOrRejectPendingActionRoute.create(
      useCases.pendingAction.approveOrReject,
      authorization
    ),

    CreateSubscriptionRoute.create(useCases.subscription.create, authorization),
    CancelSubscriptionRoute.create(useCases.subscription.cancel, authorization),
    GetSubscriptionByCompanyRoute.create(
      useCases.subscription.getByCompany,
      authorization
    ),

    CreateInvoiceRoute.create(useCases.invoice.create, authorization),
    GetInvoiceByIdRoute.create(useCases.invoice.getById, authorization),
    GetInvoicesByCompanyRoute.create(
      useCases.invoice.getAllByCompany,
      authorization
    ),
    MarkInvoiceAsPaidRoute.create(useCases.invoice.paid, authorization),
  ];
}
