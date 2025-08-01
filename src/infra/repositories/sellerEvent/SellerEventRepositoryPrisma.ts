import { PrismaClient, Event } from "@prisma/client";
import { ISellerEventGateway } from "../../../domain/entities/sellerEvent/ISellerEventGateway";
import { SellerEvent } from "../../../domain/entities/sellerEvent/SellerEvent";
import { SellerProps } from "../../../domain/entities/seller/Seller";

export class SellerEventRepositoryPrisma implements ISellerEventGateway {
  private constructor(private readonly prisma: PrismaClient) {}

  public static create(prisma: PrismaClient) {
    return new SellerEventRepositoryPrisma(prisma);
  }

  async save(sellerEvent: SellerEvent): Promise<void> {
    try {
      await this.prisma.sellerEvent.create({
        data: this.toRaw(sellerEvent),
      });
    } catch (error: any) {
      throw new Error("Error saving seller-event relation: " + error.message);
    }
  }

  async delete(sellerId: string, eventId: string): Promise<void> {
    try {
      await this.prisma.sellerEvent.delete({
        where: {
          sellerId_eventId: {
            sellerId,
            eventId,
          },
        },
      });
    } catch (error: any) {
      throw new Error("Error deleting seller from event: " + error.message);
    }
  }

  async listSellersByEvent(eventId: string): Promise<SellerEvent[]> {
    try {
      const relations = await this.prisma.sellerEvent.findMany({
        where: { eventId },
        include: {
          seller: {
            include: {
              sales: {
                orderBy: { createdAt: "desc" },
                where: { eventId },
                include: { product: true },
              },
            },
          },
        },
      });

      return relations.map((relation) => this.toEntity(relation));
    } catch (error: any) {
      throw new Error("Error listing sellers by event: " + error.message);
    }
  }

  async listEventsBySeller(sellerId: string): Promise<Event[]> {
    try {
      const relations = await this.prisma.sellerEvent.findMany({
        where: { sellerId },
        include: {
          event: true,
        },
      });

      return relations.map((relation) => relation.event);
    } catch (error: any) {
      throw new Error("Error listing events by seller: " + error.message);
    }
  }

  async findByEventAndSeller(
    sellerId: string,
    eventId: string
  ): Promise<SellerEvent | null> {
    try {
      const record = await this.prisma.sellerEvent.findUnique({
        where: {
          sellerId_eventId: {
            sellerId,
            eventId,
          },
        },
        include: {
          seller: true,
          event: true,
        },
      });

      if (!record) return null;

      return this.toEntity(record);
    } catch (error: any) {
      throw new Error("Error finding seller-event relation: " + error.message);
    }
  }

  private toEntity(raw: any): SellerEvent {
    return SellerEvent.with({
      id: raw.id,
      sellerId: raw.sellerId,
      eventId: raw.eventId,
      seller: raw.seller as SellerProps,
    });
  }

  private toRaw(entity: SellerEvent) {
    return {
      id: entity.id,
      sellerId: entity.sellerId,
      eventId: entity.eventId,
    };
  }
}
