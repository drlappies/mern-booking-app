const Owner = require('../model/Owner');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Service = require('../model/Service')
const Invoice = require('../model/Invoice');

module.exports.onboard = async (req, res, next) => {
    try {
        const { id } = req.user
        const owner = await Owner.findById(id)
        const accountLinks = await stripe.accountLinks.create({
            account: owner.stripe_id,
            refresh_url: 'http://localhost:3000/user',
            return_url: 'http://localhost:3000/user',
            type: 'account_onboarding'
        })
        res.json({
            url: accountLinks.url
        })
    } catch (err) {
        next(err)
    }
}

module.exports.getOnboardStatus = async (req, res, next) => {
    try {
        const { id } = req.user;
        const owner = await Owner.findById(id)
        const account = await stripe.accounts.retrieve(owner.stripe_id);
        res.json({
            email: account.email,
            isOnboarded: account.charges_enabled && account.details_submitted ? true : false
        })
    } catch (err) {
        next(err)
    }
}

module.exports.getPaymentIntent = async (req, res, next) => {
    try {
        const { serviceId, appointments } = req.body;
        const service = await Service.findById(serviceId)
            .populate('owner');
        const { pricing } = service
        const paymentIntent = await stripe.paymentIntents.create({
            payment_method_types: ['card'],
            amount: appointments.length * pricing * 100,
            currency: 'hkd',
            application_fee_amount: Math.round(appointments.length * pricing * 0.05)
        }, {
            stripeAccount: service.owner.stripe_id
        });
        res.json({
            client_secret: paymentIntent.client_secret,
            connected_stripe_account_id: service.owner.stripe_id,
            pricing: pricing
        })
    } catch (err) {
        next(err)
    }
}

module.exports.getInvoices = async (req, res, next) => {
    try {
        const { id } = req.user;
        const invoices = await Invoice.find({})
            .where('finder')
            .equals(id)
            .sort({ 'createdAt': 'descending' })
            .populate('owner')
            .populate('appointment')
            .populate('service')
            .populate({
                path: 'service',
                populate: 'room'
            })
        res.json({
            invoices: invoices
        })
    } catch (err) {
        next(err)
    }
}