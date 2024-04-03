import { NextFunction, Request, Response } from "express";
import { jwtAdapter } from "../config";
import { prisma } from "../data";

interface usuario{
    id?:string,
    email?:string,
    password?:string,
    name?:string
}

declare global {
    namespace Express {
      interface Request {
        user?: usuario;
      }
    }
}

export const validateTokenUser=async(req:Request,res:Response,next:NextFunction)=>{

  try {

    let token=req.headers?.authorization;
    if(!token) return res.status(400).json({error:'no hay un token para autorizar la peticion'});

    token=token.split(" ")[1];
    const tokendata:any=await jwtAdapter.validateToken(token);
    if(!tokendata) return res.status(400).json({error:'token no valido'});
      
      const userData = await prisma.usuario.findUnique({
        where: {
          id: tokendata.data,
        },
      });
      
      if (userData) {
        req.user = {
          id:userData.id,
          email:userData.email,
          name:userData.name!
        };
      }

      next();//hojo con esta linea

    } catch (error) {
      return res.status(500).json({error:'Error del servidor al validar el token de usuario'});
    }
}

/* export const validateTokenUser=async(req:Request,res:Response,next:NextFunction)=>{

    try {
        const token = req.cookies["tokenRefresh"];
        if(!token) return res.status(400).json({error:'no hay un token en la solicitud'});
        const verifyToken: any = await jwtAdapter.validateToken(token);
        if(!verifyToken) return  res.status(401).json({error:'token invalido del usuario'});
        
        const userData = await prisma.usuario.findUnique({
          where: {
            id: verifyToken.data,
          },
        });
        
        if (userData) {
          // Elimina la propiedad password del objeto userData
          const { password, ...userWithoutPassword } = userData;
          req.user = userWithoutPassword;
        }

        next();//hojo con esta linea
      } catch (error) {
        return res.status(500).json({error:'Error del servidor al validar el token de usuario'});
      }




   

} */