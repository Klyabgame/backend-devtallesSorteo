import { AppRoutes } from "./presentation/route";
import { Server } from "./presentation/server";
import 'dotenv/config';

(async () => {
  main();
})();

function main() {
  const server = new Server({
    port: +process.env.PORT!,
    public_path: process.env.PUBLIC_PATH,
    routes: AppRoutes.routes,
  });

  server.start();
}
