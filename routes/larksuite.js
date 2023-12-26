const CourseController = require('../controllers/courseController');
const LecturerController = require('../controllers/lecturerController');
const OrderController = require('../controllers/orderController');
const midleware = require('../midleware/midleware');
const router = require('express').Router();

router.post('/lark-data/order', midleware.verifyTokenLarkSuite,OrderController.create);
router.get('/lark-data', CourseController.show);
router.get('/lark-data/lecturer', midleware.verifyTokenLarkSuite, LecturerController.show);
module.exports = router;

