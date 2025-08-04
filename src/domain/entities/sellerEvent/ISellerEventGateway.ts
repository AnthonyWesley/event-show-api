import { Event, SellerEvent } from "@prisma/client";

export interface ISellerEventGateway {
  save(sellerEvent: SellerEvent): Promise<void>;
  delete(sellerId: string, eventId: string): Promise<void>;
  listEventsBySeller(sellerId: string): Promise<Event[]>;
  listSellersByEvent(eventId: string): Promise<any[]>;
  setIsSellerGoalCustom(eventId: string, value: boolean): Promise<void>;
  updateById(sellerEventId: string, goal: number): Promise<SellerEvent>;
  findByEventAndSeller(
    sellerId: string,
    eventId: string
  ): Promise<SellerEvent | null>;
}
