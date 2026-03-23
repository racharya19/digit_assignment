const service = require('../services/advocateService');

exports.create = async (req, res) => {
  const result = await service.create(req.body);
  res.json(result);
};

exports.update = async (req, res) => {
  const result = await service.update(req.body);
  res.json(result);
};

exports.search = async (req, res) => {
  const result = await service.search(req.body);
  res.json(result);
};
