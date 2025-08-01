import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthTokenService } from "../../../service/AuthTokenService";

interface AuthRequest extends Request {
  user?: JwtPayload;
  admin?: JwtPayload;
}

export class AuthorizationRoute {
  private constructor(private readonly auth: AuthTokenService) {}

  static create(auth: AuthTokenService) {
    return new AuthorizationRoute(auth);
  }

  public readonly userRoute = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const rawToken = req.header("Authorization")?.replace("Bearer ", "");
    if (!rawToken) {
      return res.status(401).json({ message: "Token not provided." });
    }

    try {
      req.user = this.auth.verifyToken(rawToken);
      next();
    } catch {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
  };

  public readonly adminRoute = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const rawToken = req.header("Authorization")?.replace("Bearer ", "");
    if (!rawToken) {
      return res.status(401).json({ message: "Token not provided." });
    }

    try {
      const payload = this.auth.verifyToken(rawToken);
      if (payload.role !== "admin") {
        return res.status(403).json({ message: "Admins only." });
      }
      req.admin = payload;
      next();
    } catch {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
  };
}
