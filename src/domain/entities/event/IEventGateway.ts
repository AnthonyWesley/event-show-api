import { DeletePartnerEventInputDto } from "../../../usecase/event/DeletePartnerEvent";
import { FindPartnerEventInputDto } from "../../../usecase/event/FindPartnerEvent";
import { UpdatePartnerEventInputDto } from "../../../usecase/event/UpdatePartnerEvent";
import { Event } from "./Event";

export interface IEventGateway {
  save(event: Event): Promise<void>;
  list(eventId: string): Promise<Event[]>;
  findById(input: FindPartnerEventInputDto): Promise<Event | null>;
  findActiveByPartnerId(input: FindPartnerEventInputDto): Promise<Event[]>;
  findLastEventByPartner(partnerId: string): Promise<Event | null>;
  update(input: UpdatePartnerEventInputDto): Promise<Event>;
  delete(input: DeletePartnerEventInputDto): Promise<void>;
}
