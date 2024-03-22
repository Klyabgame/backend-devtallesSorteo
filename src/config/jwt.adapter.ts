import jwt from "jsonwebtoken";

export const jwtAdapter = {
  
  generateToken: async (payload: any, jwt_seed:string = process.env.TOKEN_SECRET! ) => {
    return new Promise((resolve) => {
      jwt.sign({data:payload}, jwt_seed, {expiresIn:'2h'}, (err: any, token: any) => {
        if (err) return resolve(null);
        resolve(token);
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
