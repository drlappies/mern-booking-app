const Invoice = require('../model/Invoice');

module.exports.getInvoiceByFinder = async (id) => {
    const invoice = await Invoice.find({ finder: id })
        .populate('owner', '-room -permission -username -number -stripe_id -hash -createdAt -updatedAt -__v')
        .populate('service', '-owner -room -isOnline -remark -capacity -pricing -__v')

    return invoice
}

module.exports.getInvoiceById = async (id) => {
    const [invoice] = await Invoice.find({ _id: id })
        .populate('appointment', '-createdAt -room -service -updatedAt -__v -_id -user')
        .populate('service', '-_id -room -remark -owner -__v -isOnline -capacity')
        .populate('owner', '-_id -createdAt -updatedAt -hash -number -permission -room -stripe_id -updatedAt -username -__v')

    return invoice
}