import { Request, Response } from "express";

export class HealthRoute {
  static create() {
    return {
      path: "/health",
      method: "get",
      handler: async (req: Request, res: Response) => {
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
      }
    };
  }
} 