import { customAlphabet } from "nanoid";
import { ulid } from "ulid";

export const generateId = (): string => ulid();

export const generateInviteCode = () =>
  customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ123456789", 6);
