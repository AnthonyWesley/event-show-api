import { DeletePartnerEventInputDto } from "../../../usecase/event/DeleteEvent";
import { FindPartnerEventInputDto } from "../../../usecase/event/FindEvent";
import { UpdatePartnerEventInputDto } from "../../../usecase/event/UpdateEvent";
import { Event } from "./Event";

export interface IEventGateway {
  save(event: Event): Promise<void>;
  list(eventId: string, search?: string): Promise<Event[]>;
  findById(input: FindPartnerEventInputDto): Promise<Event | null>;
  findActiveByPartnerId(input: FindPartnerEventInputDto): Promise<Event[]>;
  findLastEventByPartner(partnerId: string): Promise<Event | null>;
  update(input: UpdatePartnerEventInputDto): Promise<Event>;
  delete(input: DeletePartnerEventInputDto): Promise<void>;
}
