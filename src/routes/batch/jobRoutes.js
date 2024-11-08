import express from 'express';
import {
  getDataList,
  getDataDetail,
  createData,
  updateData,
  deleteData,
  deleteAllData,
} from '../../controllers/batch/jobController';

const router = express.Router();

router.get('/list', getDataList);
router.get('/detail', getDataDetail);
router.post('/save', createData);
router.put('/save', updateData);
router.delete('/delete', deleteData);
router.delete('/deleteAll', deleteAllData);

export default router;
