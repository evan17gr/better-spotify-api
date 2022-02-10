import axios from 'axios';
import { Request, Response } from 'express';
import { arrayToString, cookiesToObject } from '../../helpers/general.js';
import crypto from 'crypto';

const stateKey = 'state_key';
const clientId = process.env.SPOTIFY_CLIENT_ID;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const clientSecret = process.env.SPOTIFY_SECRET;

export async function login(_req: Request, res: Response, next: (arg0: unknown) => void) {
  try {
    const state = crypto.randomBytes(16).toString('base64');
    res.cookie(stateKey, state);

    const scope = [
      'ugc-image-upload',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-private',
      'user-follow-modify',
      'user-follow-read',
      'user-library-modify',
      'user-library-read',
      'streaming',
      'user-read-playback-position',
      'playlist-modify-private',
      'playlist-read-collaborative',
      'app-remote-control',
      'user-read-email',
      'playlist-read-private',
      'user-top-read',
      'playlist-modify-public',
      'user-read-currently-playing',
      'user-read-recently-played',
    ];
    let params: string = '';

    if (redirect_uri && clientId) {
      params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        scope: arrayToString(scope),
        redirect_uri: redirect_uri,
        state,
      }).toString();

      res.redirect('https://accounts.spotify.com/authorize?' + params);
    } else {
      return res.status(401).redirect('http://localhost:3000');
    }
  } catch (err: any) {
    res.status(401).redirect('http://localhost:3000');
    next(err);
  }
}

export async function callback(req: Request, res: Response, next: (arg0: unknown) => void) {
  try {
    const { code, state } = req.query;
    let storedState = req.cookies ? req.cookies[stateKey] : null;

    if (!state || storedState !== state) {
      res.status(404).json({ message: 'State changed, couldn"t log in' });
    } else {
      res.clearCookie(stateKey);
      const basicHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

      let body = {};

      if (clientId && redirect_uri && typeof code === 'string') {
        body = new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirect_uri,
        }).toString();
      }

      const { data } = await axios({
        url: 'https://accounts.spotify.com/api/token',
        method: 'post',
        data: body,
        withCredentials: true,
        headers: {
          Authorization: `Basic ${basicHeader}`,
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (data) {
        res.cookie('access_token', data.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: true,
        });

        res.cookie('refresh_token', data.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: true,
        });

        res.status(200).redirect(`http://localhost:3000?access_token=${data.access_token}`);
      } else {
        return res.status(401).redirect('http://localhost:3000');
      }
    }
  } catch (err: any) {
    res.status(401).redirect('http://localhost:3000');
    next(err);
  }
}

export async function refreshToken(req: Request, res: Response, next: (arg0: unknown) => void) {
  try {
    let cookies = req.headers.cookie;
    let refresh_token = '';
    if (cookies) {
      refresh_token = cookiesToObject(cookies)['refresh_token'];
    }

    console.log(refresh_token, 'refresh_token');
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    });

    const basicHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const { data } = await axios({
      url: 'https://accounts.spotify.com/api/token',
      method: 'post',
      data: body,
      withCredentials: true,
      headers: {
        Authorization: `Basic ${basicHeader}`,
      },
    });

    if (data) {
      // console.log(data.access_token);
      res.cookie('access_token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: true,
      });

      res.status(200).send({ access_token: data.access_token });
    }
  } catch (err: any) {
    res.status(401).send({ error: "Couln't retrieve a new access token" });
    next(err);
  }
}

export async function logout(_req: Request, res: Response, next: (arg0: unknown) => void) {
  try {
    res.json('Hello');
  } catch (err: any) {
    console.error(`Error while deleting programming language`, err.message);
    next(err);
  }
}

export async function getProfile(req: Request, res: Response, next: (arg0: unknown) => void) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const { data } = await axios.get('https://api.spotify.com/v1/me', {
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
      });
      console.log(data);
    } else {
      res.sendStatus(401);
    }
  } catch (err: any) {
    console.error(`Error while deleting programming language`, err.message);
    next(err);
  }
}
