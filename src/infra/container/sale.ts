import { CreateSale } from "../../usecase/sale/CreateSale";
import { DeleteSale } from "../../usecase/sale/DeleteSale";
import { FindSale } from "../../usecase/sale/FindSale";
import { ListSale } from "../../usecase/sale/ListSale";
import { UpdateSale } from "../../usecase/sale/UpdateSale";
import { EventRepositoryPrisma } from "../repositories/event/EventRepositoryPrisma";
import { ProductRepositoryPrisma } from "../repositories/product/ProductRepositoryPrisma";

import { SaleRepositoryPrisma } from "../repositories/sale/SaleRepositoryPrisma";
import { SellerRepositoryPrisma } from "../repositories/seller/SellerRepositoryPrisma";
import { SocketServer } from "../socket/SocketServer";

export function makeSaleUseCases(
  saleRepository: SaleRepositoryPrisma,
  eventRepository: EventRepositoryPrisma,
  productRepository: ProductRepositoryPrisma,
  sellerRepository: SellerRepositoryPrisma,
  socketServer: SocketServer
) {
  return {
    create: CreateSale.create(
      saleRepository,
      eventRepository,
      productRepository,
      sellerRepository,
      socketServer
    ),
    list: ListSale.create(
      saleRepository,
      eventRepository,
      productRepository,
      sellerRepository
    ),
    findOne: FindSale.create(
      saleRepository,
      eventRepository,
      productRepository,
      sellerRepository
    ),
    delete: DeleteSale.create(
      saleRepository,
      eventRepository,
      productRepository,
      sellerRepository,
      socketServer
    ),
    update: UpdateSale.create(
      saleRepository,
      eventRepository,
      productRepository,
      sellerRepository
    ),
  };
}
