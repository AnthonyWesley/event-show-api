import { PrismaClient, Event } from "@prisma/client";
import { ISellerEventGateway } from "../../../domain/entities/sellerEvent/ISellerEventGateway";
import { SellerEvent } from "../../../domain/entities/sellerEvent/SellerEvent";
import { SellerProps } from "../../../domain/entities/seller/Seller";
import { NotFound } from "@aws-sdk/client-s3";
import { NotFoundError } from "../../../shared/errors/NotFoundError";

export class SellerEventRepositoryPrisma implements ISellerEventGateway {
  private constructor(private readonly prisma: PrismaClient) {}

  public static create(prisma: PrismaClient) {
    return new SellerEventRepositoryPrisma(prisma);
  }

  async save(sellerEvent: SellerEvent): Promise<void> {
    try {
      const data = {
        sellerId: sellerEvent.sellerId,
        eventId: sellerEvent.eventId,
        goal: sellerEvent.goal,
      };
      await this.prisma.sellerEvent.create({
        data,
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
          event: {
            select: {
              id: true,
              name: true,
              goal: true,
            },
          },
          seller: {
            include: {
              sales: {
                orderBy: { createdAt: "desc" },
                where: { eventId },
                include: {
                  product: true,
                },
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

  async updateById(sellerEventId: string, goal: number): Promise<SellerEvent> {
    try {
      const updated = await this.prisma.sellerEvent.update({
        where: { id: sellerEventId },
        data: { goal },
      });
      return this.toEntity(updated);
    } catch (error: any) {
      throw new Error("Error updating sellerEvent: " + error.message);
    }
  }

  async setIsSellerGoalCustom(eventId: string, value: boolean): Promise<void> {
    try {
      await this.prisma.event.update({
        where: { id: eventId },
        data: { isSellerGoalCustom: value },
      });
    } catch (error: any) {
      throw new Error("Error setting isSellerGoalCustom: " + error.message);
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
          event: {
            select: {
              id: true,
              name: true,
              goal: true,
              isSellerGoalCustom: true,
            },
          },
          seller: {
            include: {
              sales: {
                orderBy: { createdAt: "desc" },
                where: { eventId },
                include: {
                  product: true,
                },
              },
            },
          },
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
      event: raw.event,
      goal: raw.goal,
      eventId: raw.eventId,
      seller: raw.seller as SellerProps,
    });
  }

  private toRaw(entity: SellerEvent) {
    return {
      id: entity.id,
      sellerId: entity.sellerId,
      seller: entity.seller,
      event: entity.event,
      eventId: entity.eventId,
    };
  }
}
