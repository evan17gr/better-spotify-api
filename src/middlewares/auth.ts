import { Request, Response, NextFunction } from 'express';
import { cookiesToObject } from '../helpers/general.js';

export const checkAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const cookies = req.headers.cookie;

  if (!cookies || !authHeader) {
    return res.status(403).send({ error: 'No tokens available' });
  }
  let access_token = '';
  if (cookies) {
    access_token = cookiesToObject(cookies)['access_token'];
  }
  const bearerToken = authHeader.split(' ')[1];

  if (access_token !== bearerToken) {
    return res.status(401).send({ error: 'Token has expired' });
  }
  next();
};
