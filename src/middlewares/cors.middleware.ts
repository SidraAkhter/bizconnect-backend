import { Request, Response, NextFunction } from 'express';
import { config } from '../config/app.config';

export const corsOptionsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    console.log('Received OPTIONS request', req.headers);
    res.header('Access-Control-Allow-Origin', config.FRONTEND_ORIGIN);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', 'set-cookie');
    return res.status(200).send();
  }
  next();
}; 