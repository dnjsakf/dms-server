import express from 'express';
import {
  getDataList,
} from '../../controllers/mobinogi/runeController';

const router = express.Router();

router.get('/list', getDataList);

export default router;
