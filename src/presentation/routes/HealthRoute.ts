import { Request, Response } from "express";
import { IRoute, HttpMethod } from "./IRoute";

export class HealthRoute implements IRoute {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod
  ) {}

  static create() {
    return new HealthRoute("/health", HttpMethod.GET);
  }

  getHandler() {
    return async (req: Request, res: Response) => {
      try {
        res.status(200).json({
          status: "ok",
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: process.env.NODE_ENV || "development"
        });
      } catch (error) {
        res.status(500).json({
          status: "error",
          message: "Health check failed"
        });
      }
    };
  }

  getPath() {
    return this.path;
  }

  getMethod() {
    return this.method;
  }
} 