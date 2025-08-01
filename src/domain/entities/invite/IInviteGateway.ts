import { Invite } from "./Invite";

export interface IInviteGateway {
  save(invite: Invite): Promise<void>;
  listByEvent(eventId: string): Promise<Invite[]>;
  listBySeller(saleId: string): Promise<Invite[]>;
  findByCode(code: string): Promise<Invite | null>;
  findBySellerEventId(sellerEventId: string): Promise<Invite | null>;
  // update(input: UpdateSaleInputDto): Promise<Invite>;
  delete(code: string): Promise<void>;
}
