import { Response, Request, NextFunction } from "express";

export type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export const HttpMethod = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
  PATCH: "patch",
} as const;

export interface IRoute<Req extends Request = Request> {
  getHandler(): (request: Req, response: Response) => Promise<void>;
  getPath(): string;
  getMethod(): HttpMethod;
  getMiddlewares?(): Array<
    (req: Req, res: Response, next: NextFunction) => void
  >;
}
