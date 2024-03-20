import express, { Router } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { envs } from "../config";

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}

export class Server {
  private app = express();
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = "public" } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  async start() {
    //* Middlewares
    this.app.use(
      cors({
        origin: [
          `${envs.FRONTEND_URL}/`,
          "http://localhost:3000",
          "http://localhost:3001",
        ],
        allowedHeaders: ["Content-Type", "withCredentials", "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods"],
        credentials: true,
      })
    );

    this.app.use(express.json()); // raw
    this.app.use(morgan("dev"));
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded
    this.app.use(cookieParser());

    //* Public Folder
    /* this.app.use(express.static(this.publicPath)); */

    //* Routes
    this.app.use(this.routes);

    //* SPA
    /*this.app.get("*", (req, res) => {
      const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
      res.sendFile(indexPath);
    }); */

    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}
