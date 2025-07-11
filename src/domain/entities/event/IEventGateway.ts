import { DeleteEventInputDto } from "../../../usecase/event/DeleteEvent";
import { FindEventInputDto } from "../../../usecase/event/FindEvent";
import { UpdateEventInputDto } from "../../../usecase/event/UpdateEvent";
import { Event } from "./Event";

export interface IEventGateway {
  save(event: Event): Promise<void>;
  list(eventId: string, search?: string): Promise<Event[]>;
  findById(input: FindEventInputDto): Promise<Event | null>;
  findActiveByCompanyId(input: FindEventInputDto): Promise<Event[]>;
  findLastEventByCompany(companyId: string): Promise<Event | null>;
  update(input: UpdateEventInputDto): Promise<Event>;
  delete(input: DeleteEventInputDto): Promise<void>;
}
