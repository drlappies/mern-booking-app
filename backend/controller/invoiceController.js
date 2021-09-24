const { getInvoiceByFinder, getInvoiceById } = require('../service/invoiceService')

module.exports.fetchInvoiceByFinder = async (req, res) => {
    try {
        const { id } = req.user
        const invoice = await getInvoiceByFinder(id)
        return res.status(200).json({
            invoice: invoice
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err })
    }
}

module.exports.fetchInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await getInvoiceById(id)
        return res.status(200).json({
            invoice: invoice
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err })
    }
}