import { User } from '@prisma/client';
import prisma from '../database.js';
import { SpotifyUser } from '../types/user';
import { Response } from 'express';

export const checkUserExists = async (data: SpotifyUser | null, res: Response) => {
  try {
    if (data) {
      const userProfile: User | null = await prisma.user.findUnique({
        where: { name: data.id },
      });
      if (!userProfile) {
        await prisma.user.create({
          data: {
            display_name: data.display_name,
            country: data.country,
            name: data.id,
            followers: data.followers.total,
            image: data.images[0].url,
            profileUri: data.uri,
          },
        });
      }
    }
  } catch (err: any) {
    return res.status(403).send({ error: "Couldn't update user" });
  }
};
