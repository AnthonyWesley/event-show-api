import { Response, Request, NextFunction } from "express";

export type HttpMethod = "get" | "post" | "put" | "delete";

export const HttpMethod = {
  GET: "get" as HttpMethod,
  POST: "post" as HttpMethod,
  PUT: "put" as HttpMethod,
  DELETE: "delete" as HttpMethod,
  PATCH: "patch" as HttpMethod,
} as const;

export interface IRoute {
  getHandler(): (request: Request, response: Response) => Promise<void>;
  getPath(): string;
  getMethod(): HttpMethod;
  getMiddlewares?(): (req: Request, res: Response, next: NextFunction) => void;
}
