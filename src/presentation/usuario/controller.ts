import { Request, Response } from "express";
import { prisma } from "../../data";
import { bcryptAdapter, jwtAdapter } from "../../config";
import { maxAgeHour } from "../../helpers/maxAgeCookieHour.helpers";

export class usuarioController {
  constructor() {
    this.loginUsuario = this.loginUsuario.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.RegisterUsuario = this.RegisterUsuario.bind(this);
    this.DeleteUsuario = this.DeleteUsuario.bind(this);
    this.validateTokenUser = this.validateTokenUser.bind(this);
    this.getUsers=this.getUsers.bind(this);
  }


  async getUsers(req: Request, res: Response){

    const dataUsers=await prisma.usuario.findMany();

    return res.status(200).json(dataUsers);

  }

  async loginUsuario(req: Request, res: Response) {
    const { email, password } = req.body;

    const emailExist = await prisma.usuario.findUnique({
      where: {
        email: email,
      },
    });
    if (!emailExist)
      return res.status(400).json({
        error: "El usuario o la contraseña son incorrectos-correo",
      });

    const passwordUnhashed = await bcryptAdapter.compare(password, emailExist.password);
    if (!passwordUnhashed)
      return res.status(400).json({
        error: "El usuario o la contraseña son incorrectos-password",
      });

    const token = await jwtAdapter.generateToken(emailExist.id);
    

    res.cookie("token", token, { httpOnly: true,secure:true,sameSite:'none',maxAge:maxAgeHour(2) });

    return res.status(200).json(emailExist.email);
  }

  async RegisterUsuario(req: Request, res: Response) {
    const { email, password, name } = req.body; //esto me retorna el body del post
    const passwordHashed = bcryptAdapter.hash(password);

    const userData = {
      email,
      password: passwordHashed,
      name,
    };
    const userPost = await prisma.usuario.create({
      data: userData,
    });

    if (!userPost) {
      return res.status(400).json({ error: "No se pudo registrar el usuario correctamente" });
    }

    return res.status(200).json({
      user: {
        id: userPost.id,
        email: userPost.email,
        name: userPost.name,
      },
    });
  }

  async DeleteUsuario(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "no colocaste un id valido" });

    try {
      const registroDelete = await prisma.usuario.delete({
        where: {
          id: id,
        },
      });
      const { password, ...rest } = registroDelete;
      return res.status(200).json({ delete: "Usuario eliminado correctamente", rest });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "El usuario no existe" });
    }
  }

  async validateTokenUser(req: Request, res: Response) {
    try {
      const token = req.cookies["token"];
      const verifyToken: any = await jwtAdapter.validateToken(token);
      
      
      const userData = await prisma.usuario.findUnique({
        where: {
          id: verifyToken.data,
        },
      });

      return res.status(200).json({
        user: {
          id: userData?.id,
          email: userData?.email,
          name: userData?.name,
        },
      }); //hojo con esta linea
    } catch (error) {
      return res.status(401).json({error:'No hay un token de usuario'});
    }
  }

  async logoutUser(req: Request, res: Response) {
    try {
      const token=req.cookies['token'];
      if(!token) return res.status(400).json({error:'no existe un usuario activo'})
      
      res.clearCookie('token');
      return res.status(200).json({
          logout:'cerraste sesion correctamente'
      });
    } catch (error) {
        return res.status(500).json({error:'Error al cerrar Sesion'});
        
    }
  }
}
