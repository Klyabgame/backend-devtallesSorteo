import { Router } from "express";
import { SorteoController } from "./controller";
import { validateTokenUser } from "../../middleware";

export class SorteoRoutes {
  static get routes(): Router {
    const router = Router();

    const controller = new SorteoController();
    // Definir las rutas
    router.get("/", controller.getSorteos);
    router.get("/:id", controller.getSorteosOne);
    router.post("/",[validateTokenUser], controller.postSorteos);
    router.patch("/:id",[validateTokenUser], controller.patchSorteos);

    router.delete("/:id",[validateTokenUser], controller.deleteSorteos);

    return router;
  }
}
