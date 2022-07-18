const express = require('express');
const router = express.Router();
const enrolledController = require('../controllers/enrolledController');
const auth = require('../middlewares/auth');
router.get('/', auth ,enrolledController.showAllEnrolledUsers);
router.post('/enroll/:id', auth , enrolledController.enroll_post);
router.get('/enroll/get/:id', auth , enrolledController.enroll_get);
router.post('/save/personal/:id', auth , enrolledController.personal_post);
router.get('/save/personal/:id', auth , enrolledController.personal_get);
router.post('/save/academic/:id', auth , enrolledController.academic_post);
router.get('/save/academic/:id', auth , enrolledController.academic_get);
router.post('/save/work/:id', auth , enrolledController.work_post);
router.get('/save/work/:id', auth , enrolledController.work_get);
router.post('/save/test/:id', auth , enrolledController.test_post);
router.get('/save/test/:id', auth , enrolledController.test_get);
router.get('/profile/:id', auth , enrolledController.profile);
router.get('/document/:id', auth , enrolledController.document);

module.exports = router;