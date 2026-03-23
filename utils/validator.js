const Joi = require('joi');

const requestInfoSchema = Joi.object({
  apiId: Joi.string().required(),
  ver: Joi.string().required(),
  ts: Joi.string().optional(),
  action: Joi.string().required(),
  authToken: Joi.string().optional()
});

const advocateSchema = Joi.object({
  id: Joi.string().optional(),
  applicationNumber: Joi.string().optional(),
  name: Joi.string().required(),
  mobileNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
  email: Joi.string().email().optional(),
  status: Joi.string().optional(),
  tenantId: Joi.string().required()
});

exports.createSchema = Joi.object({
  RequestInfo: requestInfoSchema.required(),
  Advocate: advocateSchema.required()
});

exports.updateSchema = Joi.object({
  RequestInfo: requestInfoSchema.required(),
  Advocate: advocateSchema.keys({
    id: Joi.string().required()
  }).required()
});

exports.searchSchema = Joi.object({
  RequestInfo: requestInfoSchema.required(),
  mobileNumber: Joi.string().pattern(/^[0-9]{10}$/).optional()
});
exports.validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      ResponseInfo: req.body.RequestInfo,
      Errors: error.details.map(d => d.message)
    });
  }
  next();
};