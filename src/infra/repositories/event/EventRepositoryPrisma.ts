import { GoalType, PrismaClient } from "@prisma/client";
import { Event } from "../../../domain/entities/event/Event";
import { IEventGateway } from "../../../domain/entities/event/IEventGateway";
import { DeletePartnerEventInputDto } from "../../../usecase/event/DeleteEvent";
import { FindPartnerEventInputDto } from "../../../usecase/event/FindEvent";
import { UpdatePartnerEventInputDto } from "../../../usecase/event/UpdateEvent";

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
          endDate: event.endDate,
          partnerId: event.partnerId,
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

  async list(partnerId: string, search: string): Promise<Event[]> {
    const filters: any = {
      partnerId,
    };

    if (search) {
      filters.OR = [{ name: { contains: search, mode: "insensitive" } }];
    }

    const events = await this.prismaClient.event.findMany({
      where: filters,
      include: {
        sales: true,
        sellerEvents: true,
      },
    });

    return events.map((event) =>
      Event.with({
        id: event.id,
        name: event.name,
        photo: event.photo ?? "",
        photoPublicId: event.photoPublicId ?? "",
        startDate: event.startDate,
        endDate: event.endDate ?? undefined,
        partnerId: event.partnerId,
        isActive: event.isActive,
        goal: event.goal,
        goalType: event.goalType,
        createdAt: event.createdAt,
        sales: event.sales,
        sellerEvents: event.sellerEvents,
      })
    );
  }

  async update(input: UpdatePartnerEventInputDto): Promise<Event> {
    try {
      const dataToUpdate: any = {};

      if (input.name !== undefined) dataToUpdate.name = input.name;
      if (input.photo !== undefined) dataToUpdate.photo = input.photo;
      if (input.photoPublicId !== undefined)
        dataToUpdate.photoPublicId = input.photoPublicId;
      if (input.startDate !== undefined)
        dataToUpdate.startDate = input.startDate;
      if (input.endDate !== undefined) dataToUpdate.endDate = input.endDate;
      if (input.isActive !== undefined) dataToUpdate.isActive = input.isActive;
      if (input.goal !== undefined) dataToUpdate.goal = input.goal;
      if (input.goalType !== undefined) dataToUpdate.goalType = input.goalType;

      const updated = await this.prismaClient.event.update({
        where: {
          id: input.eventId,
          partnerId: input.partnerId,
        },
        data: dataToUpdate,
        include: {
          sales: true,
          sellerEvents: true,
        },
      });

      return Event.with({
        id: updated.id,
        name: updated.name,
        photo: updated.photo ?? undefined,
        photoPublicId: updated.photoPublicId ?? undefined,
        startDate: updated.startDate,
        endDate: updated.endDate ?? undefined,
        partnerId: updated.partnerId,
        isActive: updated.isActive,
        goal: updated.goal,
        goalType: updated.goalType,
        createdAt: updated.createdAt,
        sales: updated.sales,
        sellerEvents: updated.sellerEvents,
      });
    } catch (error: any) {
      throw new Error(`Error updating event: ${error.message}`);
    }
  }

  async delete(input: DeletePartnerEventInputDto): Promise<void> {
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

  async findById(input: FindPartnerEventInputDto): Promise<Event | null> {
    try {
      const event = await this.prismaClient.event.findUnique({
        where: {
          id: input.eventId,
          partnerId: input.partnerId,
        },
        include: {
          sales: true,
          sellerEvents: true,
        },
      });

      if (!event) return null;

      return Event.with({
        id: event.id,
        name: event.name,
        photo: event.photo ?? "",
        photoPublicId: event.photoPublicId ?? "",
        startDate: event.startDate,
        endDate: event.endDate ?? undefined,
        partnerId: event.partnerId,
        goal: event.goal,
        isActive: event.isActive,
        goalType: event.goalType,
        createdAt: event.createdAt,
        sales: event.sales,
        sellerEvents: event.sellerEvents,
      });
    } catch (error: any) {
      throw new Error(`Error finding event: ${error.message}`);
    }
  }

  async findActiveByPartnerId(
    input: FindPartnerEventInputDto
  ): Promise<Event[]> {
    try {
      const events = await this.prismaClient.event.findMany({
        where: {
          // id: input.eventId,
          partnerId: input.partnerId,
          isActive: true,
        },
        include: {
          sales: true,
          sellerEvents: true,
        },
      });

      // if (!events) return null;

      return events.map((event) =>
        Event.with({
          id: event.id,
          name: event.name,
          photo: event.photo ?? "",
          photoPublicId: event.photoPublicId ?? "",
          startDate: event.startDate,
          endDate: event.endDate ?? undefined,
          partnerId: event.partnerId,
          isActive: event.isActive,
          goal: event.goal,
          goalType: event.goalType,
          createdAt: event.createdAt,
          sales: event.sales,
          sellerEvents: event.sellerEvents,
        })
      );
    } catch (error: any) {
      throw new Error(`Error finding event: ${error.message}`);
    }
  }

  async findLastEventByPartner(partnerId: string): Promise<Event | null> {
    try {
      const event = await this.prismaClient.event.findFirst({
        where: { partnerId },
        orderBy: { endDate: "desc" },
        include: {
          sales: true,
          sellerEvents: true,
        },
      });

      if (!event) return null;

      return Event.with({
        id: event.id,
        name: event.name,
        photo: event.photo ?? "",
        photoPublicId: event.photoPublicId ?? "",
        startDate: event.startDate,
        endDate: event.endDate ?? undefined,
        partnerId: event.partnerId,
        goal: event.goal,
        isActive: event.isActive,
        goalType: event.goalType,
        createdAt: event.createdAt,
        sales: event.sales,
        sellerEvents: event.sellerEvents,
      });
    } catch (error: any) {
      throw new Error(`Error finding last event: ${error.message}`);
    }
  }
}
