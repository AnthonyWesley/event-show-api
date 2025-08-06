import { ulid } from "ulid";

export const generateId = (): string => ulid();

export const generateInviteCode = (): string => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";
  const length = 6;
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    code += alphabet[randomIndex];
  }

  return code;
};
