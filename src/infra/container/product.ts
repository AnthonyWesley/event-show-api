import { CreateProduct } from "../../usecase/product/CreateProduct";
import { DeleteProduct } from "../../usecase/product/DeleteProduct";
import { FindProduct } from "../../usecase/product/FindProduct";
import { ListProduct } from "../../usecase/product/ListProduct";
import { UpdateProduct } from "../../usecase/product/UpdateProduct";
import { UpdateProductPhoto } from "../../usecase/product/UpdateProductPhoto";
import { CompanyRepositoryPrisma } from "../repositories/company/CompanyRepositoryPrisma";
import { ProductRepositoryPrisma } from "../repositories/product/ProductRepositoryPrisma";
import { CloudinaryUploadService } from "../services/CloudinaryUploadService";

export function makeProductUseCases(
  productRepository: ProductRepositoryPrisma,
  companyRepository: CompanyRepositoryPrisma,
  uploadPhotoService: CloudinaryUploadService
) {
  return {
    create: CreateProduct.create(productRepository, companyRepository),
    list: ListProduct.create(productRepository, companyRepository),
    findOne: FindProduct.create(productRepository, companyRepository),
    delete: DeleteProduct.create(productRepository, companyRepository),
    update: UpdateProduct.create(productRepository, companyRepository),
    updatePhoto: UpdateProductPhoto.create(
      productRepository,
      companyRepository,
      uploadPhotoService
    ),
  };
}
