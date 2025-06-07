import { CreateSale } from "../../usecase/sale/CreateSale";
import { DeleteSale } from "../../usecase/sale/DeleteSale";
import { FindSale } from "../../usecase/sale/FindSale";
import { ListSale } from "../../usecase/sale/ListSale";
import { UpdateSale } from "../../usecase/sale/UpdateSale";
import {
  eventRepository,
  productRepository,
  sellerRepository,
} from "../Container";
import { SaleRepositoryPrisma } from "../repositories/sale/SaleRepositoryPrisma";

export function makeSaleUseCases(saleRepository: SaleRepositoryPrisma) {
  return {
    create: CreateSale.create(
      saleRepository,
      eventRepository,
      productRepository,
      sellerRepository
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
      sellerRepository
    ),
    update: UpdateSale.create(
      saleRepository,
      eventRepository,
      productRepository,
      sellerRepository
    ),
  };
}
