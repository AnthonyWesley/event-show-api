import "express-async-errors";
import cors from "cors";
import express, { ErrorRequestHandler } from "express";
import { IRoute } from "../../../presentation/routes/IRoute";
import { ErrorHandler } from "../../http/middlewares/ErrorHandler";
import cookieParser from "cookie-parser";
import { createServer, Server as HttpServer } from "http";
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.0.93",
  "http://192.168.0.93:5173",
  "http://192.168.100.62:5173",
  "https://event-flow-awl.netlify.app",
];

export class ApiExpress {
  private app: express.Application;
  private httpServer: HttpServer;

  private constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);

    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        credentials: true,
      })
    );

    this.app.use(ErrorHandler as ErrorRequestHandler);
  }

  public static create(): ApiExpress {
    return new ApiExpress();
  }

  public setRoutes(routes: IRoute[]): void {
    routes.forEach((route) => {
      const rawMiddlewares = route.getMiddlewares?.();
      const middlewares = Array.isArray(rawMiddlewares)
        ? rawMiddlewares
        : rawMiddlewares
        ? [rawMiddlewares]
        : [];

      this.app[route.getMethod()](
        route.getPath(),
        ...middlewares,
        route.getHandler()
      );
    });
  }

  public getHttpServer(): HttpServer {
    return this.httpServer;
  }

  public getApp(): express.Application {
    return this.app;
  }

  public start(port: number): void {
    this.httpServer.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
    this.listIRoutes();
  }

  private listIRoutes() {
    const routes = this.app._router.stack
      .filter((route: any) => route.route)
      .map((route: any) => ({
        path: route.route.path,
        method: route.route.stack[0].method,
      }));

    console.log(routes);
  }
}
