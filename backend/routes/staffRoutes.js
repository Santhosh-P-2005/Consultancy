const express = require('express');
const router = express.Router();
const {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getDepartments
} = require('../controllers/staffController');

// Protect middleware can be added here
// const { protect } = require('../middleware/auth');

// Staff routes
router.route('/')
  .get(getAllStaff)
  .post(createStaff);

router.route('/departments')
  .get(getDepartments);

router.route('/:id')
  .get(getStaffById)
  .put(updateStaff)
  .delete(deleteStaff);

module.exports = router;