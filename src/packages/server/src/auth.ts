import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import config from './config';

export type AuthUserInfo = {
   id: string;
   admin?: boolean;
};

export function generateAccessToken(user: AuthUserInfo) {
   return jwt.sign(user, config.api.tokenSecret, { expiresIn: '14 days' });
}

export function verifyToken(token: string) {
   return new Promise<AuthUserInfo>((resolve, reject) => {
      jwt.verify(token, config.api.tokenSecret, (err: any, user: any) => {
         if (err) {
            reject(err);
            return;
         }

         resolve(user as AuthUserInfo);
      });
   });
}

/**
 * Middleware for express.js that authenticates the jwt and adds the field user to the
 * request (of type AuthUserInfo)
 */
export const authenticateToken: RequestHandler = async (req, res, next) => {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];

   if (token == null) return res.sendStatus(401);

   try {
      const user = await verifyToken(token);
      (req as any).user = user;
   } catch (error) {
      res.sendStatus(403);
      return;
   }

   next();
};
