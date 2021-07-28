const express = require('express');
const router = express.Router();
const { createService, getService, editService, deleteService } = require('../controller/serviceController');
const { isAuthorised } = require('../utils/middleware');

router.post('/', isAuthorised, createService);

router.get('/:id', getService);

router.put('/:id', isAuthorised, editService);

router.delete('/:id', isAuthorised, deleteService);

module.exports = router
