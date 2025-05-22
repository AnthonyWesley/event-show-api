import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError";

export class Authorization {
  private constructor(private readonly secretKey: string) {}

  static create(secretKey: string) {
    return new Authorization(secretKey);
  }

  generateToken(payload: object, expiresIn: any = 1): string {
    if (!this.secretKey) {
      throw new Error("Secret key for JWT is not defined.");
    }
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }

  verifyToken(token: string): JwtPayload | string {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired token.");
    }
  }

  authorizationRoute = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const token = request.header("Authorization");

      if (!token) {
        return response
          .status(401)
          .json({ message: "Access denied. Token not provided." });
      }

      const decoded = this.verifyToken(token.replace("Bearer ", ""));
      (request as any).partner = decoded;
      next();
    } catch (error) {
      return response.status(401).json({ message: "Invalid token." });
    }
  };

  partnerAndGuestAuthorizationRoute = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const partnerToken = request.header("Partner-Authorization");
      const guestToken = request.header("Guest-Authorization");

      if (!partnerToken && !guestToken) {
        return response.status(401).json({
          message: "Access denied. No token provided.",
        });
      }

      if (partnerToken) {
        const partnerDecoded = this.verifyToken(
          partnerToken.replace("Bearer ", "")
        );
        (request as any).partner = partnerDecoded;
      }

      if (guestToken) {
        const guestDecoded = this.verifyToken(
          guestToken.replace("Bearer ", "")
        );
        (request as any).guest = guestDecoded;
      }

      next();
    } catch (error) {
      return response.status(403).json({
        message: "Invalid or expired partner or guest token.",
      });
    }
  };

  decodeToken(token: string) {
    try {
      return jwt.decode(token);
    } catch {
      return null;
    }
  }
}
