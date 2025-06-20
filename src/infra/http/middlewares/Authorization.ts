import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError";

interface AuthRequest extends Request {
  partner?: JwtPayload;
  admin?: JwtPayload;
}

export class Authorization {
  private constructor(private readonly secretKey: string) {}

  static create(secretKey: string) {
    return new Authorization(secretKey);
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

  authorizationRoute = (
    request: AuthRequest,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const rawToken =
        request.header("Authorization")?.replace("Bearer ", "") ||
        (request.query.token as string);

      if (!rawToken) {
        return response
          .status(401)
          .json({ message: "Access denied. Token not provided." });
      }

      const decoded = this.verifyToken(rawToken);
      request.partner = decoded;
      next();
    } catch (error) {
      return response.status(401).json({ message: "Invalid token." });
    }
  };

  adminAuthorizationRoute = (
    request: AuthRequest,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const token = request.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        return response.status(401).json({ message: "No token provided." });
      }

      const decoded = this.verifyToken(token);
      if (decoded.role !== "admin") {
        return response.status(403).json({ message: "Admins only." });
      }

      request.admin = decoded;
      next();
    } catch (error) {
      return response
        .status(403)
        .json({ message: "Invalid or expired token." });
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
