import { Event, GoalMode, SellerEvent } from "@prisma/client";

export interface ISellerEventGateway {
  save(sellerEvent: SellerEvent): Promise<void>;
  delete(sellerId: string, eventId: string): Promise<void>;
  listEventsBySeller(sellerId: string): Promise<Event[]>;
  listSellersByEvent(eventId: string): Promise<any[]>;
  setIsSellerGoalCustom(eventId: string, goalMode: GoalMode): Promise<void>;
  updateById(
    sellerId: string,
    eventId: string,
    goal: number
  ): Promise<SellerEvent>;
  findByEventAndSeller(
    sellerId: string,
    eventId: string
  ): Promise<SellerEvent | null>;
}
