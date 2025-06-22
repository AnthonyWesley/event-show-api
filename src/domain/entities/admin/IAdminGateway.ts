import { Admin } from "./Admin";

export interface IAdminGateway {
  save(Admin: Admin): Promise<void>;
  findById(id: string): Promise<Admin | null>;
  findByEmail(email: string): Promise<Admin | null>;
  findByRefreshToken(refreshToken: string): Promise<string | null>;
}
