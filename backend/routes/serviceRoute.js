const express = require('express');
const router = express.Router();
const { createService, getService, editService, deleteService, getServices } = require('../controller/serviceController');
const { isAuthorised } = require('../utils/middleware');

router.get('/', getServices);
router.get('/:id', getService);
router.put('/:id', isAuthorised, editService);
router.post('/', isAuthorised, createService);
router.delete('/:id', isAuthorised, deleteService);

module.exports = router
