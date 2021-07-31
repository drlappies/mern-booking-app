const Owner = require('../model/Owner');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Service = require('../model/Service')

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
        const { roomId, serviceId, appointments, pricing } = req.body;
        const service = await Service.findById(serviceId)
            .populate('owner');
        if (service.pricing !== pricing) return res.json('price has been manipulated')
        const { stripe_id } = service.owner
        const paymentIntent = await stripe.paymentIntents.create({
            payment_method_types: ['card'],
            amount: appointments.length * pricing * 100,
            currency: 'hkd',
            application_fee_amount: Math.round(appointments.length * pricing * 0.05)
        }, {
            stripeAccount: stripe_id
        });
        res.json({
            client_secret: paymentIntent.client_secret,
            connected_stripe_account_id: stripe_id
        })
    } catch (err) {
        next(err)
    }
}