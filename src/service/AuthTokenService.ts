import { UnauthorizedError } from "../shared/errors/UnauthorizedError";
import jwt, { JwtPayload } from "jsonwebtoken";

export class AuthTokenService {
  constructor(private readonly secretKey: string) {
    if (!secretKey) throw new Error("Missing JWT secret key.");
  }

  generateToken(payload: object, expiresIn: any = "1d"): string {
    if (!this.secretKey) {
      throw new Error("Secret key for JWT is not defined.");
    }
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.secretKey) as JwtPayload;
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired token.");
    }
  }

  decodeToken(token: string) {
    return jwt.decode(token);
  }
}
