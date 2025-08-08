import { GoalMode, GoalType, PrismaClient } from "@prisma/client";
import { Event } from "../../../domain/entities/event/Event";
import { IEventGateway } from "../../../domain/entities/event/IEventGateway";
import { DeleteEventInputDto } from "../../../usecase/event/DeleteEvent";
import { FindEventInputDto } from "../../../usecase/event/FindEvent";
import { UpdateEventInputDto } from "../../../usecase/event/UpdateEvent";
import { ObjectHelper } from "../../../shared/utils/ObjectHelper";

export class EventRepositoryPrisma implements IEventGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new EventRepositoryPrisma(prismaClient);
  }

  async save(event: Event): Promise<void> {
    try {
      await this.prismaClient.event.create({
        data: {
          id: event.id,
          name: event.name,
          photo: event.photo,
          startDate: event.startDate,
          inviteValidityDays: event.inviteValidityDays,
          endDate: event.endDate,
          companyId: event.companyId,
          isActive: event.isActive,
          goal: event.goal,
          goalType: event.goalType as GoalType,
          createdAt: event.createdAt,
        },
      });
    } catch (error: any) {
      throw new Error(`Error saving event: ${error.message}`);
    }
  }

  async list(companyId: string, search: string): Promise<Event[]> {
    const filters: any = {
      companyId,
    };

    if (search) {
      filters.OR = [{ name: { contains: search, mode: "insensitive" } }];
    }

    const events = await this.prismaClient.event.findMany({
      where: filters,
      include: {
        sales: { orderBy: { createdAt: "desc" }, include: { seller: true } },
        sellerEvents: true,
      },
    });

    return events.map((event) => this.toEntity(event));
  }

  async update(input: UpdateEventInputDto): Promise<Event> {
    try {
      const dataToUpdate = ObjectHelper.removeUndefinedFields({
        name: input.name,
        photo: input.photo,
        photoPublicId: input.photoPublicId,
        startDate: input.startDate,
        endDate: input.endDate,
        inviteValidityDays: input.inviteValidityDays,
        isActive: input.isActive,
        goal: input.goal,
        goalType: input.goalType,
        goalMode: input.goalMode,
      });

      const updated = await this.prismaClient.event.update({
        where: {
          id: input.eventId,
          companyId: input.companyId,
        },
        data: dataToUpdate,
        include: {
          sales: true,
          sellerEvents: true,
        },
      });

      return this.toEntity(updated);
    } catch (error: any) {
      throw new Error(`Error updating event: ${error.message}`);
    }
  }

  async delete(input: DeleteEventInputDto): Promise<void> {
    const event = await this.findById(input);

    if (!event) {
      throw new Error("Event not found.");
    }

    try {
      await this.prismaClient.event.delete({
        where: { id: input.eventId },
      });
    } catch (error: any) {
      throw new Error(`Error deleting event: ${error.message}`);
    }
  }

  async countActiveByCompany(companyId: string): Promise<number> {
    return await this.prismaClient.event.count({
      where: {
        companyId,
        isActive: true,
      },
    });
  }
  async countWasPresentBySeller(sellerId: string): Promise<number> {
    return await this.prismaClient.lead.count({
      where: {
        sellerId,
        wasPresent: true,
      },
    });
  }
  async setIsSellerGoalCustom(
    eventId: string,
    goalMode: GoalMode
  ): Promise<void> {
    await this.prismaClient.event.update({
      where: { id: eventId },
      data: { goalMode },
    });
  }

  async findById(input: FindEventInputDto): Promise<Event | null> {
    try {
      const event = await this.prismaClient.event.findUnique({
        where: {
          id: input.eventId,
          companyId: input.companyId,
        },
        include: {
          sales: { include: { seller: true } },
          sellerEvents: {
            include: {
              seller: {
                select: {
                  name: true,
                  phone: true,
                  photo: true,
                  id: true,
                  email: true,
                  leads: true,
                },
              },
            },
          },
          leads: true,
        },
      });

      if (!event) return null;

      return this.toEntity(event);
    } catch (error: any) {
      throw new Error(`Error finding event: ${error.message}`);
    }
  }

  async findActiveByCompanyId(input: FindEventInputDto): Promise<Event[]> {
    try {
      const events = await this.prismaClient.event.findMany({
        where: {
          companyId: input.companyId,
          isActive: true,
        },
        include: {
          sales: true,
          sellerEvents: true,
        },
      });

      return events.map((event) => this.toEntity(event));
    } catch (error: any) {
      throw new Error(`Error finding event: ${error.message}`);
    }
  }

  async findLastEventByCompany(companyId: string): Promise<Event | null> {
    try {
      const event = await this.prismaClient.event.findFirst({
        where: { companyId },
        orderBy: { endDate: "desc" },
        include: {
          sales: true,
          sellerEvents: true,
        },
      });

      if (!event) return null;

      return this.toEntity(event);
    } catch (error: any) {
      throw new Error(`Error finding last event: ${error.message}`);
    }
  }

  private toEntity(raw: any): Event {
    return Event.with({
      id: raw.id,
      name: raw.name,
      photo: raw.photo ?? "",
      photoPublicId: raw.photoPublicId ?? "",
      startDate: raw.startDate,
      endDate: raw.endDate ?? undefined,
      companyId: raw.companyId,
      goal: raw.goal,
      goalMode: raw.goalMode,
      leads: raw.leads,
      inviteValidityDays: raw.inviteValidityDays,
      isActive: raw.isActive,
      goalType: raw.goalType,
      createdAt: raw.createdAt,
      sales: raw.sales,
      sellerEvents: raw.sellerEvents,
    });
  }
}
