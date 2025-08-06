import { PrismaClient } from "@prisma/client";
import { Sale } from "../../../domain/entities/sale/Sale";
import { ISaleGateway } from "../../../domain/entities/sale/ISaleGateway";
import { UpdateSaleInputDto } from "../../../usecase/sale/UpdateSale";
import { DeleteSaleInputDto } from "../../../usecase/sale/DeleteSale";
import {
  FindSaleInputDto,
  FindSaleOutputDto,
} from "../../../usecase/sale/FindSale";
import { Lead } from "../../../domain/entities/lead/Lead";
import { generateId } from "../../../shared/utils/IdGenerator";
import { ObjectHelper } from "../../../shared/utils/ObjectHelper";

export class SaleRepositoryPrisma implements ISaleGateway {
  private constructor(private readonly prisma: PrismaClient) {}

  public static create(prisma: PrismaClient) {
    return new SaleRepositoryPrisma(prisma);
  }

  async save(sale: Sale, lead?: Lead): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        let aLead = null;

        // 1. Tenta buscar o lead por ID (caso já exista)
        if (sale.leadId) {
          aLead = await tx.lead.findFirst({ where: { id: sale.leadId } });

          // Se encontrou o lead e ainda não foi convertido, marca como convertido
          if (aLead && !aLead.convertedAt) {
            await tx.lead.update({
              where: { id: aLead.id },
              data: {
                convertedAt: new Date(),
                sellerId: sale.sellerId,
                status: "CONVERTED",
              },
            });
          }
        }

        // 2. Se não encontrou o lead ainda, tenta buscar ou criar a partir dos dados do `lead`
        if (!aLead && lead) {
          // Protege contra tentativas de criação com dados incompletos
          if (!lead.name || !lead.eventId || !lead.companyId) {
            throw new Error("Dados obrigatórios do lead ausentes.");
          }

          // Busca lead existente por phone + eventId + companyId
          aLead = await tx.lead.findFirst({
            where: {
              phone: lead.phone,
              eventId: lead.eventId,
              companyId: lead.companyId,
            },
          });

          // Se não existir ainda, cria
          if (!aLead) {
            aLead = await tx.lead.create({
              data: {
                id: lead.id ?? generateId(),
                name: lead.name,
                phone: lead.phone,
                notes: lead.notes,
                customInterest: lead.customInterest,
                leadSourceId: lead.leadSourceId ?? undefined,
                sellerId: lead.sellerId ?? undefined,
                eventId: lead.eventId,
                companyId: lead.companyId,
                createdAt: new Date(),
                products: lead.products?.length
                  ? {
                      connect: lead.products.map((p) => ({ id: p.id })),
                    }
                  : undefined,
              },
            });
          }

          // Marca como convertido após criar/buscar
          if (aLead && !aLead.convertedAt) {
            await tx.lead.update({
              where: { id: aLead.id },
              data: {
                convertedAt: new Date(),
                sellerId: sale.sellerId,
                status: "CONVERTED",
              },
            });
          }
        }

        // 3. Cria a venda
        await tx.sale.create({
          data: {
            id: sale.id,
            productId: sale.productId,
            eventId: sale.eventId,
            sellerId: sale.sellerId,
            quantity: sale.quantity,
            leadId: aLead?.id ?? sale.leadId,
            createdAt: sale.createdAt,
          },
        });

        // 4. Atualiza produtos do lead se necessário
        if (
          aLead &&
          lead?.products?.length &&
          (!aLead.products || aLead.products.length === 0)
        ) {
          await tx.lead.update({
            where: { id: aLead.id },
            data: {
              products: {
                connect: lead.products.map((p) => ({ id: p.id })),
              },
            },
          });
        }
      });
    } catch (error: any) {
      throw new Error("Error saving sale: " + error.message);
    }
  }

  async list(eventId: string): Promise<Sale[]> {
    const sales = await this.prisma.sale.findMany({
      orderBy: { createdAt: "desc" },
      where: { eventId },
      include: { product: true, lead: true, seller: true },
    });

    return sales.map(this.toEntity);
  }

  async update(input: UpdateSaleInputDto): Promise<Sale> {
    try {
      const dataToUpdate = ObjectHelper.removeUndefinedFields({
        quantity: input.quantity,
      });

      const updatedSale = await this.prisma.sale.update({
        where: {
          id: input.saleId,
        },
        data: dataToUpdate,
      });

      return this.toEntity(updatedSale);
    } catch (error: any) {
      throw new Error("Error updating sale: " + error.message);
    }
  }

  async delete(input: DeleteSaleInputDto): Promise<void> {
    const sale = await this.prisma.sale.findUnique({
      where: { id: input.saleId },
    });

    if (!sale) {
      throw new Error("Sale not found or does not belong to the company.");
    }

    try {
      await this.prisma.sale.delete({
        where: { id: input.saleId, eventId: input.eventId },
      });
    } catch (error: any) {
      throw new Error("Error deleting sale: " + error.message);
    }
  }

  async findById(input: FindSaleInputDto): Promise<FindSaleOutputDto | null> {
    try {
      const sale = await this.prisma.sale.findUnique({
        where: {
          id: input.saleId,
          eventId: input.eventId,
        },
        include: { seller: true, product: true, lead: true },
      });

      if (!sale) return null;

      return {
        ...this.toEntity(sale),
        product: {
          id: sale.product.id,
          name: sale.product.name,
          price: sale.product.price,
        },
        seller: {
          id: sale.seller.id,
          name: sale.seller.name,
        },
      } as FindSaleOutputDto;
    } catch (error: any) {
      throw new Error("Error finding sale: " + error.message);
    }
  }

  private toEntity(raw: any): Sale {
    return Sale.with({
      id: raw.id,
      eventId: raw.eventId,
      sellerId: raw.sellerId,
      productId: raw.productId,
      seller: raw.seller,
      product: raw.product,
      lead: raw.lead,
      quantity: raw.quantity,
      createdAt: raw.createdAt,
      leadId: raw.leadId,
    });
  }
}
