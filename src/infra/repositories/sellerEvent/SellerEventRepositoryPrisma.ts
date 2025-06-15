import { Event, PrismaClient } from "@prisma/client";
import { ISellerEventGateway } from "../../../domain/entities/sellerEvent/ISellerEventGateway";
import { SellerEvent } from "../../../domain/entities/sellerEvent/SellerEvent";
import { SellerProps } from "../../../domain/entities/seller/Seller";

export class SellerEventRepositoryPrisma implements ISellerEventGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new SellerEventRepositoryPrisma(prismaClient);
  }

  async save(sellerEvent: SellerEvent): Promise<void> {
    try {
      await this.prismaClient.sellerEvent.create({
        data: {
          id: sellerEvent.id,
          sellerId: sellerEvent.sellerId,
          eventId: sellerEvent.eventId,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error saving seller-event relation: " + error.message);
      }
      throw error;
    }
  }

  async delete(sellerId: string, eventId: string): Promise<void> {
    try {
      await this.prismaClient.sellerEvent.delete({
        where: {
          sellerId_eventId: {
            sellerId,
            eventId,
          },
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error deleting seller from event: " + error.message);
      }
      throw error;
    }
  }

  async listSellersByEvent(eventId: string): Promise<SellerEvent[]> {
    const relations = await this.prismaClient.sellerEvent.findMany({
      where: { eventId },
      include: {
        seller: {
          include: {
            sales: {
              where: { eventId },
              include: { product: true },
            },
          },
        },
      },
    });

    return relations.map((relation) =>
      SellerEvent.with({
        id: relation.id,
        sellerId: relation.sellerId,
        eventId: relation.eventId,
        seller: relation.seller as SellerProps,
      })
    );
  }

  async listEventsBySeller(sellerId: string): Promise<Event[]> {
    const relations = await this.prismaClient.sellerEvent.findMany({
      where: { sellerId },
      include: {
        event: true,
      },
    });

    return relations.map((relation) => relation.event);
  }

  async findByEventAndSeller(
    sellerId: string,
    eventId: string
  ): Promise<SellerEvent | null> {
    const record = await this.prismaClient.sellerEvent.findUnique({
      where: {
        sellerId_eventId: {
          sellerId,
          eventId,
        },
      },
    });

    return record ? SellerEvent.with(record) : null;
  }
}
