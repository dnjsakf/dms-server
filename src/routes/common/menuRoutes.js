import express from 'express';
import {
  getDataList,
  getDataDetail,
  getDataRole,
  createData,
  updateData,
  deleteData,
  deleteAllData,
} from '../../controllers/common/menuController';

const router = express.Router();

router.get('/list', getDataList);
router.get('/detail', getDataDetail);
router.get('/role', getDataRole);
router.post('/save', createData);
router.put('/save', updateData);
router.delete('/delete', deleteData);
router.delete('/deleteAll', deleteAllData);

export default router;
