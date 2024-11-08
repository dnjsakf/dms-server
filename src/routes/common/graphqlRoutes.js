import express from 'express';
import { getGraphiql } from '../../controllers/common/graphqlController';

const router = express.Router();

router.get('/', getGraphiql);

export default router;

