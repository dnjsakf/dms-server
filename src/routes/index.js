import express from 'express';

import commonRoutes from './common/commonRoutes';
import graphqlRoutes from './common/graphqlRoutes';
import authRoutes from './common/authRoutes';
import userRoutes from './common/userRoutes';
import menuRoutes from './common/menuRoutes';
import groupRoutes from './common/groupRoutes';
import roleRoutes from './common/roleRoutes';
import permissionRoutes from './common/permissionRoutes';
import codeRoutes from './common/codeRoutes';
import codeItemRoutes from './common/codeItemRoutes';

import jobRoutes from './batch/jobRoutes';
import jobScheduleRoutes from './batch/jobScheduleRoutes';

const router = express.Router();

// common
router.use('/', commonRoutes);
router.use('/graphiql', graphqlRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/menu', menuRoutes);
router.use('/group', groupRoutes);
router.use('/role', roleRoutes);
router.use('/permission', permissionRoutes);
router.use('/code', codeRoutes);
router.use('/code/item', codeItemRoutes);

// batch
router.use('/job', jobRoutes);
router.use('/job/schedule', jobScheduleRoutes);

export default router;
