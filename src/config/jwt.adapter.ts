import { Response } from "express";
import jwt from "jsonwebtoken";
import { maxCookieAgeDay, maxTokenAgeDay, maxTokenAgeMinute } from "../helpers";

export const jwtAdapter = {
  
  generateToken: async (payload: any, jwt_seed:string = process.env.TOKEN_SECRET! ) => {
    return new Promise((resolve) => {
      jwt.sign({data:payload}, jwt_seed, {expiresIn:maxTokenAgeMinute(15)}, (err: any, token: any) => {
        if (err) return resolve(null);
        resolve(token);
      });
    });
  },
  generateTokenRefresh: async (payload: any,res:Response, jwt_seed:string = process.env.TOKEN_SECRET! ) => {

    return new Promise((resolve) => {
      jwt.sign({data:payload}, jwt_seed, {expiresIn:maxTokenAgeDay(30)}, (err: any, token: any) => {
        if (err) return resolve(null);
        res.cookie('tokenRefresh',token,{
          httpOnly:true,
          sameSite:'none',
          secure:true,
          maxAge:maxCookieAgeDay(30)
        })
        resolve({ok:'Refresh token - creado'});
      });
    });
  },

  validateToken: (token: string) => {
    return new Promise((resolve) => {
      jwt.verify(token, process.env.TOKEN_SECRET!, (err: any, decoded: any) => {
        if (err) return resolve(null);
        resolve(decoded);
      });
    });
  },
};
