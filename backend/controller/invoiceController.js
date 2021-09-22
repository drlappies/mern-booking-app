const { getInvoiceByFinder, getInvoiceById } = require('../service/invoiceService')

module.exports.fetchInvoiceByFinder = async (req, res, next) => {
    try {
        const { id } = req.user
        const invoice = await getInvoiceByFinder(id)
        return res.status(200).json({
            invoice: invoice
        })
    } catch (err) {
        next(err)
    }
}

module.exports.fetchInvoiceById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const invoice = await getInvoiceById(id)
        return res.status(200).json({
            invoice: invoice
        })
    } catch (err) {
        next(err)
    }
}