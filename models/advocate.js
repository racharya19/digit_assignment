const mongoose = require('mongoose');

const AdvocateSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'ID is required']
  },

  applicationNumber: {
    type: String,
    required: [true, 'Application number is required'],
    unique: true
  },

  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters']
  },

  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^[0-9]{10}$/, 'Mobile number must be 10 digits']
  },

  email: {
    type: String,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format']
  },

  status: {
    type: String,
    enum: {
      values: ['INITIATED', 'DOCUMENT_VERIFIED', 'APPROVED', 'REJECTED'],
      message: 'Invalid status value'
    },
    default: 'INITIATED'
  },

  tenantId: {
    type: String,
    required: [true, 'TenantId is required']
  }

}, {
  timestamps: true
});


// 🔍 Indexes (important for DIGIT performance & search APIs)
AdvocateSchema.index({ mobileNumber: 1 });
AdvocateSchema.index({ applicationNumber: 1 });


// 🔥 Pre-save hook (optional advanced validation)
AdvocateSchema.pre('save', function (next) {
  if (!this.mobileNumber.startsWith('6') &&
      !this.mobileNumber.startsWith('7') &&
      !this.mobileNumber.startsWith('8') &&
      !this.mobileNumber.startsWith('9')) {
    return next(new Error('Invalid Indian mobile number'));
  }
  next();
});

module.exports = mongoose.model('Advocate', AdvocateSchema); 