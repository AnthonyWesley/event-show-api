import "express-async-errors";
import cors from "cors";
import express, { ErrorRequestHandler } from "express";
import { IRoute } from "../../../presentation/routes/IRoute";
import { ErrorHandler } from "../../http/middlewares/ErrorHandler";
import { ValidationError } from "../../../shared/errors/ValidationError";
import cookieParser from "cookie-parser";

export class ApiExpress {
  private app: express.Application;

  private constructor(routes: IRoute[]) {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true,
      })
    );
    this.registerRoutes(routes);

    this.app.use(ErrorHandler as ErrorRequestHandler);
  }

  public static create(routes: IRoute[]): ApiExpress {
    return new ApiExpress(routes);
  }

  private registerRoutes(routes: IRoute[]): void {
    this.app.get("/test-error", (req, res) => {
      throw new ValidationError("Testing error middleware");
    });
    routes.forEach((route) => {
      this.app[route.getMethod()](
        route.getPath(),
        route.getMiddlewares?.() ?? [],
        route.getHandler()
      );
    });
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
    this.listIRoutes();
  }

  private listIRoutes() {
    const routes = this.app._router.stack
      .filter((route: any) => route.route)
      .map((route: any) => {
        return {
          path: route.route.path,
          method: route.route.stack[0].method,
        };
      });

    console.log(routes);
  }
}
