const express = require('express');
const router = express.Router();
const enrolledUserController = require('../controllers/enrolledUserController');
const auth = require('../middlewares/auth');
router.get('/', auth ,enrolledUserController.showAllEnrolledUsers);
router.post('/enroll/:id', auth , enrolledUserController.enroll_post);
router.get('/enroll/get/:id', auth , enrolledUserController.enroll_get);
router.post('/save/personal/:id', auth , enrolledUserController.personal_post);
router.get('/save/personal/:id', auth , enrolledUserController.personal_get);
router.post('/save/academic/:id', auth , enrolledUserController.academic_post);
router.get('/save/academic/:id', auth , enrolledUserController.academic_get);
router.post('/save/work/:id', auth , enrolledUserController.work_post);
router.get('/save/work/:id', auth , enrolledUserController.work_get);
router.post('/save/test/:id', auth , enrolledUserController.test_post);
router.get('/save/test/:id', auth , enrolledUserController.test_get);
router.get('/profile/:id', auth , enrolledUserController.profile);
router.get('/profile/documents/:id', auth , enrolledUserController.document);

module.exports = router;