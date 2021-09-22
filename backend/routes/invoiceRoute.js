const express = require('express')
const router = express.Router()
const { isAuthorised } = require('../utils/middleware')
const { fetchInvoiceByFinder, fetchInvoiceById } = require('../controller/invoiceController')

router.get('/', isAuthorised, fetchInvoiceByFinder)
router.get('/:id', isAuthorised, fetchInvoiceById)

module.exports = router