import { CreatePartnerProduct } from "../../usecase/product/CreatePartnerProduct";
import { DeletePartnerProduct } from "../../usecase/product/DeletePartnerProduct";
import { FindPartnerProduct } from "../../usecase/product/FindPartnerProduct";
import { ListPartnerProduct } from "../../usecase/product/ListPartnerProduct";
import { UpdatePartnerProduct } from "../../usecase/product/UpdatePartnerProduct";
import { partnerRepository } from "../Container";
import { ProductRepositoryPrisma } from "../repositories/product/ProductRepositoryPrisma";

export function makeProductUseCases(
  productRepository: ProductRepositoryPrisma
) {
  return {
    create: CreatePartnerProduct.create(productRepository, partnerRepository),
    list: ListPartnerProduct.create(productRepository, partnerRepository),
    findOne: FindPartnerProduct.create(productRepository, partnerRepository),
    delete: DeletePartnerProduct.create(productRepository, partnerRepository),
    update: UpdatePartnerProduct.create(productRepository, partnerRepository),
  };
}
