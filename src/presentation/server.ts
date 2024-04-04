import express, { Router } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";

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

    const whiteList=[process.env.ORIGIN1,process.env.LocalOrigin1];
    //* Middlewares
    this.app.use(
      cors({
        origin: function(origin,callback){
          if (whiteList.includes(origin)) {
            return callback(null,origin)
          }
          return callback(new Error('Error de cors origin: '+origin+'No autorizado'));
        }
      })
    );
    /* this.app.use(cors()); */

    this.app.use(express.json()); // raw
    this.app.use(morgan("dev"));
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded
    this.app.use(cookieParser());

    //* Public Folder
     this.app.use(express.static(this.publicPath)); 

    //* Routes
    this.app.use(this.routes);

    
    this.app.get("*", (req, res) => {
      const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
      res.sendFile(indexPath);
    });

    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}
