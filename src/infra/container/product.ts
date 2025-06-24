import { CreateProduct } from "../../usecase/product/CreateProduct";
import { DeleteProduct } from "../../usecase/product/DeleteProduct";
import { FindProduct } from "../../usecase/product/FindProduct";
import { ListProduct } from "../../usecase/product/ListProduct";
import { UpdateProduct } from "../../usecase/product/UpdateProduct";
import { UpdateProductPhoto } from "../../usecase/product/UpdateProductPhoto";
import { partnerRepository } from "../Container";
import { ProductRepositoryPrisma } from "../repositories/product/ProductRepositoryPrisma";
import { CloudinaryUploadService } from "../services/CloudinaryUploadService";

export function makeProductUseCases(
  productRepository: ProductRepositoryPrisma,
  uploadPhotoService: CloudinaryUploadService
) {
  return {
    create: CreateProduct.create(productRepository, partnerRepository),
    list: ListProduct.create(productRepository, partnerRepository),
    findOne: FindProduct.create(productRepository, partnerRepository),
    delete: DeleteProduct.create(productRepository, partnerRepository),
    update: UpdateProduct.create(productRepository, partnerRepository),
    updatePhoto: UpdateProductPhoto.create(
      productRepository,
      partnerRepository,
      uploadPhotoService
    ),
  };
}
