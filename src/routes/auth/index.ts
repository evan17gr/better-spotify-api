import * as express from 'express';
import { login, logout, refreshToken, callback } from '../../controllers/auth/index.js';

const router = express.Router();

router.get('/login', login);

router.get('/callback', callback);

router.get('/refresh_token', refreshToken);

router.get('/logout', logout);

export default router;
