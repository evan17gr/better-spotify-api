import * as express from 'express';
import { login, logout, getProfile, refreshToken, callback } from '../../controllers/user/index.js';
import { checkAccessToken } from '../../middlewares/auth.js';

const router = express.Router();

router.get('/login', login);

router.get('/callback', callback);

router.get('/refresh_token', refreshToken);

router.get('/logout', logout);

router.get('/profile', checkAccessToken, getProfile);

export default router;
