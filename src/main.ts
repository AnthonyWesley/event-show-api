import { ApiExpress } from "./infra/api/express/api.express";
import { makeUseCases } from "./infra/Container";
import { Authorization } from "./infra/http/middlewares/Authorization";
import { SocketServer } from "./infra/socket/SocketServer";
import { makeRoutes } from "./presentation/routes/Routes";

function main() {
  const api = ApiExpress.create();
  const socketServer = new SocketServer(api.getHttpServer());
  const secretKey = process.env.SECRET_KEY as string;
  const authorization = Authorization.create(secretKey);
  const useCases = makeUseCases(socketServer, authorization);
  const routes = makeRoutes(useCases, authorization);

  api.setRoutes(routes);
  api.start(8000);
}

main();
