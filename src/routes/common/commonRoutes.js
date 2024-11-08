import express from 'express';
import {
  getIndex,
  getInitData,
} from '../../controllers/common/commonController';

const router = express.Router();

router.get('/', getIndex);
router.get('/init', getInitData);

export default router;

