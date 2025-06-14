import { useCases, authorization } from "../../infra/Container";
import { CreateAdminRoute } from "./admin/CreateAdminRoute";
import { ImpersonatePartnerRoute } from "./admin/ImpersonatePartnerRoute";
import { LoginAdminRoute } from "./admin/LoginAdminRoute";
import { CreatePartnerEventRoute } from "./event/CreatePartnerEventRoute";
import { DeletePartnerEventRoute } from "./event/DeletePartnerEventRoute";
import { FindPartnerEventRoute } from "./event/FindPartnerEventsRoute";
import { ListPartnerEventRoute } from "./event/ListPartnerEventsRoute";
import { SwitchPartnerEventStateRoute } from "./event/SwitchPartnerEventStateRoute";
import { UpdatePartnerEventRoute } from "./event/UpdatePartnerEventRoute";
import { CreateLeadRoute } from "./lead/CreateLeadRoute";
import { DeleteLeadRoute } from "./lead/DeleteLeadRoute";
import { ExportLeadRoute } from "./lead/ExportLeadRoute";
import { FindLeadRoute } from "./lead/FindLeadRoute";
import { ListLeadByEventRoute } from "./lead/ListLeadByEventRoute";
import { ListLeadByPartners } from "./lead/ListLeadByPartners";
import { UpdateLeadRoute } from "./lead/UpdateLeadRoute";
import { CreatePartnerRoute } from "./partner/CreatePartnerRoute";
import { DeletePartnerRoute } from "./partner/DeletePartnerRoute";
import { FindPartnerRoute } from "./partner/FindPartnerRoute";
import { ListPartnerRoute } from "./partner/ListPartnerRoute";
import { LoginPartnerRoute } from "./partner/LoginPartnerRoute";
import { LogoutPartnerRoute } from "./partner/LogoutPartnerRoute";
import { RefreshPartnerRoute } from "./partner/RefreshPartnerRoute";
import { UpdatePartnerRoute } from "./partner/UpdatePartnerRoute";
import { ApproveOrRejectPendingActionRoute } from "./pendingAction/ApproveOrRejectPendingActionRoute";
import { CreatePendingActionRoute } from "./pendingAction/CreatePendingActionRoute";
import { ListPendingActionRoute } from "./pendingAction/ListPendingActionRoute";
import { CreatePartnerProductRoute } from "./product/CreatePartnerProductRoute";
import { DeletePartnerProductRoute } from "./product/DeletePartnerProductRoute";
import { FindPartnerProductRoute } from "./product/FindPartnerProductRoute";
import { ListPartnerProductRoute } from "./product/ListPartnerProductRoute";
import { UpdatePartnerProductRoute } from "./product/UpdatePartnerProductRoute";
import { CreateSaleRoute } from "./sale/CreateSaleRoute";
import { DeleteSaleRoute } from "./sale/DeleteSaleRoute";
import { FindSaleRoute } from "./sale/FindSaleRoute";
import { ListSaleRoute } from "./sale/ListSaleRoute";
import { UpdateSaleRoute } from "./sale/UpdateSaleRoute";
import { CreateEventSellerRoute } from "./seller/CreateEventSellerRoute";
import { DeleteEventSellerRoute } from "./seller/DeleteEventSellerRoute";
import { FindEventSellerByEmailRoute } from "./seller/FindEventSellerByEmailRoute";
import { FindEventSellerRoute } from "./seller/FindEventSellerRoute";
import { ListEventSellerRoute } from "./seller/ListEventSellerRoute";
import { UpdateEventSellerRoute } from "./seller/UpdateEventSellerRoute";
import { CreateSellerEventRoute } from "./sellerEvent/CreateSellerEventRoute";
import { DeleteSellerEventRoute } from "./sellerEvent/DeleteSellerEventRoute";
import { GuestAccessRoute } from "./sellerEvent/GuestAccessRoute";
import { ListEventsBySellerRoute } from "./sellerEvent/ListEventsBySellerRoute";
import { ListSellerByEventRoute } from "./sellerEvent/ListSellerByEventRoute";

export const routes = [
  LoginAdminRoute.create(useCases.admin.login),
  CreateAdminRoute.create(useCases.admin.create),
  ImpersonatePartnerRoute.create(useCases.admin.impersonate, authorization),

  LoginPartnerRoute.create(useCases.partner.login),
  RefreshPartnerRoute.create(useCases.partner.refresh),
  LogoutPartnerRoute.create(useCases.partner.logout),
  FindPartnerRoute.create(useCases.partner.findOne, authorization),
  CreatePartnerRoute.create(useCases.partner.create),
  ListPartnerRoute.create(useCases.partner.list, authorization),
  DeletePartnerRoute.create(useCases.partner.delete, authorization),
  UpdatePartnerRoute.create(useCases.partner.update),

  CreatePartnerEventRoute.create(useCases.event.create, authorization),
  ListPartnerEventRoute.create(useCases.event.list, authorization),
  FindPartnerEventRoute.create(useCases.event.findOne, authorization),
  SwitchPartnerEventStateRoute.create(
    useCases.event.SwitchStatus,
    authorization
  ),
  DeletePartnerEventRoute.create(useCases.event.delete, authorization),
  UpdatePartnerEventRoute.create(useCases.event.update, authorization),

  CreatePartnerProductRoute.create(useCases.product.create, authorization),
  ListPartnerProductRoute.create(useCases.product.list, authorization),
  FindPartnerProductRoute.create(useCases.product.findOne, authorization),
  DeletePartnerProductRoute.create(useCases.product.delete, authorization),
  UpdatePartnerProductRoute.create(useCases.product.update, authorization),

  CreateLeadRoute.create(useCases.lead.create, authorization),
  ListLeadByEventRoute.create(useCases.lead.listByEvent, authorization),
  ExportLeadRoute.create(useCases.lead.exportLead, authorization),
  ListLeadByPartners.create(useCases.lead.listByPartner, authorization),
  FindLeadRoute.create(useCases.lead.findOne, authorization),
  DeleteLeadRoute.create(useCases.lead.delete, authorization),
  UpdateLeadRoute.create(useCases.lead.update, authorization),

  CreateEventSellerRoute.create(useCases.seller.create, authorization),
  ListEventSellerRoute.create(useCases.seller.list, authorization),
  FindEventSellerRoute.create(useCases.seller.findOne, authorization),
  FindEventSellerByEmailRoute.create(
    useCases.seller.findByEmail,
    authorization
  ),
  DeleteEventSellerRoute.create(useCases.seller.delete, authorization),
  UpdateEventSellerRoute.create(useCases.seller.update, authorization),

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
  ListEventsBySellerRoute.create(useCases.sellerEvent.listEvent, authorization),
  ListSellerByEventRoute.create(useCases.sellerEvent.listSeller, authorization),
  DeleteSellerEventRoute.create(useCases.sellerEvent.delete, authorization),

  CreatePendingActionRoute.create(useCases.pendingAction.create, authorization),
  ListPendingActionRoute.create(useCases.pendingAction.list, authorization),
  ApproveOrRejectPendingActionRoute.create(
    useCases.pendingAction.approveOrReject,
    authorization
  ),
];
