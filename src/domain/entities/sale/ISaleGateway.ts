import { DeleteSaleInputDto } from "../../../usecase/sale/DeleteSale";
import {
  FindSaleInputDto,
  FindSaleOutputDto,
} from "../../../usecase/sale/FindSale";
import { UpdateSaleInputDto } from "../../../usecase/sale/UpdateSale";
import { Sale } from "./Sale";

export interface ISaleGateway {
  save(sale: Sale): Promise<void>;
  list(saleId: string): Promise<Sale[]>;
  findById(input: FindSaleInputDto): Promise<FindSaleOutputDto | null>;
  update(input: UpdateSaleInputDto): Promise<Sale>;
  delete(input: DeleteSaleInputDto): Promise<void>;
}
