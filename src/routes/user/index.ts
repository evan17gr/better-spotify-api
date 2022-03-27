import * as express from 'express';
import { getProfile, getTopItems } from '../../controllers/user/index.js';
import { checkAccessToken } from '../../middlewares/auth.js';

const router = express.Router();

router.get('/profile/:userId', checkAccessToken, getProfile);

router.get('/getTopItems/:type', checkAccessToken, getTopItems);

export default router;
