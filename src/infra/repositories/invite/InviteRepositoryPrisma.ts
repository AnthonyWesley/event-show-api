import { PrismaClient } from "@prisma/client";
import { IInviteGateway } from "../../../domain/entities/invite/IInviteGateway";
import { Invite } from "../../../domain/entities/invite/Invite";
import { NotFoundError } from "../../../shared/errors/NotFoundError";

export class InviteRepositoryPrisma implements IInviteGateway {
  private constructor(private readonly prisma: PrismaClient) {}

  public static create(prisma: PrismaClient) {
    return new InviteRepositoryPrisma(prisma);
  }

  async save(invite: Invite): Promise<void> {
    try {
      await this.prisma.invite.create({
        data: {
          id: invite.id,
          code: invite.code,
          eventId: invite.eventId,
          sellerEventId: invite.sellerEventId,
          expiresAt: invite.expiresAt,
          createdAt: invite.createdAt,
        },
      });
    } catch (error: any) {
      throw new Error("Error saving invite: " + error.message);
    }
  }

  async listByEvent(eventId: string): Promise<Invite[]> {
    try {
      const invites = await this.prisma.invite.findMany({
        orderBy: { createdAt: "desc" },
        where: { eventId },
      });

      return invites.map(this.toEntity);
    } catch (error: any) {
      throw new Error("Error listing invites: " + error.message);
    }
  }

  async listBySeller(sellerEventId: string): Promise<Invite[]> {
    try {
      const invites = await this.prisma.invite.findMany({
        orderBy: { createdAt: "desc" },
        where: { sellerEventId },
      });

      return invites.map(this.toEntity);
    } catch (error: any) {
      throw new Error("Error listing invites: " + error.message);
    }
  }

  async findByCode(code: string): Promise<Invite | null> {
    try {
      const invite = await this.prisma.invite.findUnique({
        where: { code },
        include: { sellerEvent: true, event: true },
      });

      if (!invite) {
        return null;
      }

      return this.toEntity(invite);
    } catch (error: any) {
      throw new Error("Error listing invites: " + error.message);
    }
  }
  async findBySellerEventId(sellerEventId: string): Promise<Invite | null> {
    const invite = await this.prisma.invite.findFirst({
      where: { sellerEventId },
    });

    if (!invite) return null;

    return this.toEntity(invite);
  }

  async delete(code: string): Promise<void> {
    const invite = await this.findByCode(code);

    if (!invite) {
      throw new NotFoundError("Invite");
    }

    try {
      await this.prisma.invite.delete({
        where: { code },
      });
    } catch (error: any) {
      throw new Error("Error deleting Invite: " + error.message);
    }
  }

  private toEntity(raw: any): Invite {
    return Invite.with({
      id: raw.id,
      eventId: raw.eventId,
      event: raw.event,
      sellerEventId: raw.sellerEventId,
      code: raw.code,
      createdAt: raw.createdAt,
      sellerEvent: raw.sellerEvent,
      expiresAt: raw.expiresAt,
    });
  }
}
