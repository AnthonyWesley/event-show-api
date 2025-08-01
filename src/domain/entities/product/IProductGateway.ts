import { DeleteProductInputDto } from "../../../usecase/product/DeleteProduct";
import { FindProductInputDto } from "../../../usecase/product/FindProduct";
import { UpdateProductInputDto } from "../../../usecase/product/UpdateProduct";
import { Product } from "./Product";

export interface IProductGateway {
  save(product: Product): Promise<void>;
  list(companyId: string, search?: string): Promise<Product[]>;
  findById(input: FindProductInputDto): Promise<Product | null>;
  countByCompany(companyId: string): Promise<number>;
  update(input: UpdateProductInputDto): Promise<Product>;
  delete(input: DeleteProductInputDto): Promise<void>;
}
