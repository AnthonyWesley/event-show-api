import { ApiExpress } from "./infra/api/express/api.express";
import { routes } from "./presentation/routes/Routes";

function main() {
  const api = ApiExpress.create(routes);
  const port = 8000;
  api.start(port);
}

main();
