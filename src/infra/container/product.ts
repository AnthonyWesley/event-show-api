import { CreatePartnerProduct } from "../../usecase/product/CreatePartnerProduct";
import { DeletePartnerProduct } from "../../usecase/product/DeletePartnerProduct";
import { FindPartnerProduct } from "../../usecase/product/FindPartnerProduct";
import { ListPartnerProduct } from "../../usecase/product/ListPartnerProduct";
import { UpdatePartnerProduct } from "../../usecase/product/UpdatePartnerProduct";
import { UpdateProductPhoto } from "../../usecase/product/UpdateProductPhoto";
import { partnerRepository } from "../Container";
import { ProductRepositoryPrisma } from "../repositories/product/ProductRepositoryPrisma";
import { CloudinaryUploadService } from "../services/CloudinaryUploadService";

export function makeProductUseCases(
  productRepository: ProductRepositoryPrisma,
  uploadPhotoService: CloudinaryUploadService
) {
  return {
    create: CreatePartnerProduct.create(productRepository, partnerRepository),
    list: ListPartnerProduct.create(productRepository, partnerRepository),
    findOne: FindPartnerProduct.create(productRepository, partnerRepository),
    delete: DeletePartnerProduct.create(productRepository, partnerRepository),
    update: UpdatePartnerProduct.create(productRepository, partnerRepository),
    updatePhoto: UpdateProductPhoto.create(
      productRepository,
      partnerRepository,
      uploadPhotoService
    ),
  };
}
