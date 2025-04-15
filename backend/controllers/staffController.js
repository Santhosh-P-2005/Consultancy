const Staff = require('../models/Staff');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc Get all staff
// @route GET /api/staff
// @access Private
exports.getAllStaff = asyncHandler(async (req, res, next) => {
  // Query with filters if provided
  let query = {};
  
  // Filter by department if provided
  if (req.query.department) {
    query.department = req.query.department;
  }
  
  // Filter by active status if provided
  if (req.query.active !== undefined) {
    query.active = req.query.active === 'true';
  }
  
  // Search by name, staffId or department
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { staffId: { $regex: req.query.search, $options: 'i' } },
      { department: { $regex: req.query.search, $options: 'i' } }
    ];
  }
  
  const staff = await Staff.find(query).sort({ name: 1 });
  res.status(200).json(staff);
});

// @desc Get single staff by ID
// @route GET /api/staff/:id
// @access Private
exports.getStaffById = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findById(req.params.id);
  
  if (!staff) {
    return next(new ErrorResponse(`Staff with id ${req.params.id} not found`, 404));
  }
  
  res.status(200).json(staff);
});

// @desc Create new staff
// @route POST /api/staff
// @access Private
exports.createStaff = asyncHandler(async (req, res, next) => {
  // Check if staff with the same staffId already exists
  const existingStaff = await Staff.findOne({ staffId: req.body.staffId });
  
  if (existingStaff) {
    return next(new ErrorResponse(`Staff with ID ${req.body.staffId} already exists`, 400));
  }
  
  const staff = await Staff.create(req.body);
  res.status(201).json(staff);
});

// @desc Update staff
// @route PUT /api/staff/:id
// @access Private
exports.updateStaff = asyncHandler(async (req, res, next) => {
  let staff = await Staff.findById(req.params.id);
  
  if (!staff) {
    return next(new ErrorResponse(`Staff with id ${req.params.id} not found`, 404));
  }
  
  // Check if staffId is being updated and if it already exists
  if (req.body.staffId && req.body.staffId !== staff.staffId) {
    const existingStaff = await Staff.findOne({ staffId: req.body.staffId });
    if (existingStaff) {
      return next(new ErrorResponse(`Staff with ID ${req.body.staffId} already exists`, 400));
    }
  }
  
  staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json(staff);
});

// @desc Delete staff
// @route DELETE /api/staff/:id
// @access Private
exports.deleteStaff = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findById(req.params.id);
  
  if (!staff) {
    return next(new ErrorResponse(`Staff with id ${req.params.id} not found`, 404));
  }
  
  await staff.deleteOne();
  
  res.status(200).json({ success: true, data: {} });
});

// @desc Get all departments
// @route GET /api/staff/departments
// @access Private
exports.getDepartments = asyncHandler(async (req, res, next) => {
  const departments = await Staff.distinct('department');
  res.status(200).json(departments);
});