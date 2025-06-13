import express from 'express';
import auth from '../../controllers/common/AuthController';

const router = express.Router();

router.get('/login', auth.getLogin);
router.get('/register', auth.getRegister);

router.post('/login', auth.postLogin);
router.post('/logout', auth.postLogout);
router.post('/register', auth.postRegister);
router.post('/check-duplicate', auth.postCheckDuplicate);

router.post('/token/refresh', auth.postTokenRefresh);
router.post('/token/verify', auth.postTokenVerify);

export default router;

