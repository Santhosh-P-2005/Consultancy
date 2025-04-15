const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add staff name'],
    trim: true
  },
  staffId: {
    type: String,
    required: [true, 'Please add staff ID'],
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Please add department'],
    enum: ['stateboard', 'matric', 'aone', 'administration', 'management', 'other'],
    trim: true
  },
  cabinNo: {
    type: String,
    trim: true
  },
  yearOfJoining: {
    type: Number,
    required: [true, 'Please add year of joining'],
    min: 1980,
    max: new Date().getFullYear()
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ],
    trim: true
  },
  designation: {
    type: String,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Staff', StaffSchema);