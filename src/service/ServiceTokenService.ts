import { UnauthorizedError } from "../shared/errors/UnauthorizedError";
import jwt from "jsonwebtoken";

export class ServiceTokenService {
  constructor(private readonly secret: string) {
    if (!secret) throw new Error("Missing internal JWT secret.");
  }

  generate(service: string): string {
    return jwt.sign({ iss: service, aud: "platformcore" }, this.secret, {
      expiresIn: "2m",
    });
  }

  verify(token: string, expectedIssuers: string[], expectedAudience: string) {
    const payload = jwt.verify(token, this.secret) as jwt.JwtPayload;

    if (!expectedIssuers.includes(payload.iss ?? "")) {
      throw new UnauthorizedError("Invalid issuer.");
    }

    if (payload.aud !== expectedAudience) {
      throw new UnauthorizedError("Invalid audience.");
    }

    return payload;
  }
}
