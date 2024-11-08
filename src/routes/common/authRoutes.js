import express from 'express';
import {
  getRegister,
  getLogin,
  postLogin,
  postLogout,
  postRegister,
  postCheckDuplicate,
  postToken,
  postVerifyToken,
} from '../../controllers/common/authController';

const router = express.Router();

router.get('/login', getLogin);
router.get('/register', getRegister);

router.post('/login', postLogin);
router.post('/logout', postLogout);
router.post('/register', postRegister);
router.post('/check-duplicate', postCheckDuplicate);

router.post('/token', postToken);
router.post('/verify-token', postVerifyToken);

export default router;

