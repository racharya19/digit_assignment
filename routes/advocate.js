const express = require('express');
const router = express.Router();
const controller = require('../controllers/advocateController');
const { validate, createSchema, updateSchema, searchSchema } = require('../utils/validator');

router.post('/_create', validate(createSchema), controller.create);
router.post('/_update', validate(updateSchema), controller.update);
router.post('/_search', validate(searchSchema), controller.search);

module.exports = router;