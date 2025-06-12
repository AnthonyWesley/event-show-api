import { Partner } from "./Partner";

export interface IPartnerGateway {
  save(partner: Partner): Promise<void>;
  list(search?: string): Promise<Partner[]>;
  findById(id: string): Promise<Partner | null>;
  findByEmail(email: string): Promise<Partner | null>;
  findByRefreshToken(refreshToken: string): Promise<string | null>;
  updateRefreshToken(partnerId: string, refreshToken: string): Promise<void>;
  update(id: string, data: Partner): Promise<Partner>;
  delete(id: string): Promise<void>;
}
