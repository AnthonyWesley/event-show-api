import { ApiExpress } from "../src/infra/api/express/api.express";
import { makeUseCases } from "../src/infra/Container";
import { AuthorizationRoute } from "../src/infra/http/middlewares/AuthorizationRoute";
import { SocketServer } from "../src/infra/socket/SocketServer";
import { makeRoutes } from "../src/presentation/routes/Routes";

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
