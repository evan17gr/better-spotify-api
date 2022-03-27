import axios from 'axios';
import { Request, Response } from 'express';

const base_url = process.env.API_BASE_URL;

export async function getProfile(req: Request, res: Response, next: (arg0: unknown) => void) {
  try {
    const authHeader = req.headers.authorization;
    const { userId } = req.params;

    if (authHeader) {
      const { data } = await axios.get(`${base_url}/users/${userId}`, {
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
      });
      res.status(200).send({ data });
    } else {
      res.sendStatus(401);
    }
  } catch (err: any) {
    console.error(`Unable to get user's `, err.message);
    next(err);
  }
}

export async function getTopItems(req: Request, res: Response, next: (arg0: unknown) => void) {
  try {
    const { type } = req.params;
    const authHeader = req.headers.authorization;
    console.log(type);

    if (authHeader && type) {
      const { data } = await axios.get(`${base_url}/me/top/${type}`, {
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
      });
      return res.status(200).send({ topItems: data });
    }
    res.status(404).send({ message: 'Missing type for top items' });
  } catch (err: any) {
    res.status(404).send({ message: "Couldn't retrieve top items" });
    next(err);
  }
}
