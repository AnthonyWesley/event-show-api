import { User } from "./User";

export interface IUserGateway {
  save(user: User): Promise<void>;
  list(search?: string): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByRefreshToken(refreshToken: string): Promise<string | null>;
  updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
  update(id: string, data: User): Promise<User>;
  delete(id: string): Promise<void>;
}
